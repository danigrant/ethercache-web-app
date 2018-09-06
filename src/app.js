// @dev next steps:
// 1 - styling
// 2 - actually get past logs and display
// 3 - if no wallet, say something
// 4 - setup forwarding in cf. ethercache.me/1 => play.ethercache.me?x=addr. the fake qr needs to forqard to the nice-try page
// 5 - location checking

let ethercacheContractABI
let ethercacheContract
let currentCache
let previousVisitor = {}

let appRoot = document.getElementById('app')

let initializeWeb3 = () => {

  if (typeof web3 !== 'undefined') {
    // Use the browser's ethereum provider
    let provider = web3.currentProvider
    return web3;
  } else {
    return new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
  }
}

let userHasEthBrowser = () => {
  if (web3.eth.accounts[0] === undefined) {
    // user does not have a web3 account
    // will need to render a ui to go tell them to download cipher
    return false
  } else {
    return true
  }
}

// TODO figure out which cache it is based on querystring
// play.ethercache.me?x={addr}

let getWhichEtherCache = () => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == 'x') {
            // TODO if x = a, return obj currentCache.addr, currentCache.name
            let currentCache = {}

            // test cache
            if (decodeURIComponent(pair[1]) === '0xc1297d9bda529c5e02685a2a3862ce9b82fc5257') {
              currentCache.address = '0xc1297d9bda529c5e02685a2a3862ce9b82fc5257'
              currentCache.name = 'test'
              return currentCache
            } else {
              return
            }
        }
    }
    console.log('Ethercache addr not found in querystring');
}

let formatDate = (date) => {
  let d = new Date(date)
  return `${d.getMonth() + 1} ${d.getDate()}, ${d.getFullYear()}`
}

// show initial page
// TODO but if no web3 address, ask them to login with cipher

let currentVisitor = {
  name: '',
  message: '',
  imageUrl: ''
}

let renderStepOne = () => {
  let stepOneTemplate = (
    <div className="form-section">
      <form onSubmit={nameFormSubmit}>
        <label>First, tell me your name.</label>
        <input type="text" name="namefield" autoFocus required placeholder="dani" />
      </form>
    </div>
  )

  ReactDOM.render(stepOneTemplate, appRoot)
}

let nameFormSubmit = (e) => {
  e.preventDefault()
  currentVisitor.name = e.target.elements.namefield.value
  e.target.elements.namefield.value = ''

  renderStepTwo()
}

let renderStepTwo = (e) => {
  let stepTwoTemplate = (
    <div className="form-section">
      <form onSubmit={messageFormSubmit}>
        <label>Now let’s write a little letter to whomever finds me next.</label>
        <input type="text" name="messagefield" autoFocus required placeholder="dear stranger..." />
      </form>
    </div>
  )

  ReactDOM.render(stepTwoTemplate, appRoot)
}

let messageFormSubmit = (e) => {
  e.preventDefault()
  currentVisitor.message = e.target.elements.messagefield.value
  e.target.elements.messagefield.value = ''

  renderStepThree()
}

let renderStepThree = () => {
  let stepThreeTemplate = (
    <div className="form-section">
      <form onSubmit={photoFormSubmit}>
        <label>This is the last step. Let’s take a picture to commemorate the moment.</label>
        <input type="hidden" role="uploadcare-uploader" name="content" data-crop="1:1" data-images-only="true" />
      </form>
    </div>
  )

  ReactDOM.render(stepThreeTemplate, appRoot)

  pollForPhoto()
}

let pollForPhoto = () => {
  if (document.getElementsByName('content').length !== 0) {
    if (document.getElementsByName('content')[0].value !== "") {
      photoFormSubmit()
    }
  }
  setTimeout(pollForPhoto, 1000);
}

let photoFormSubmit = () => {
  currentVisitor.imageUrl = document.getElementsByName('content')[0].value
  document.getElementsByClassName('uploadcare--widget__text')[0].innerHTML = ''

  renderStepFour()
}

let renderStepFour = () => {
  let stepFourTemplate = (
    <div className="form-section">
      <form onSubmit={sendToEther}>
        <label>You’re a pro. Now hit send to become a part of the ethercache legend.</label>
        <button type="submit">Send Me To The Ether</button>
      </form>
    </div>
  )

  ReactDOM.render(stepFourTemplate, appRoot)
}

let sendToEther = (e) => {
  e.preventDefault()
  console.log('sent!')

  // send to web3 contract then display success screen
  // TODO this doesn't work
  let date = new Date()
  let formattedDate = date.toISOString()

  ethercacheContract.createLog(currentVisitor.name, formattedDate, '', currentVisitor.message, currentVisitor.imageUrl, function() {
    console.log('sent!')
  })

  renderSuccessScreen()
}

let renderSuccessScreen = () => {

  let successTemplate = (
    <div className="success-section">
      <div className="title-section">
        <h1>You’re done!</h1>
        <h1>You’ve left your mark on history.</h1>
        <h2>Scroll down to read messages from past visitors.</h2>
      </div>
      <div className="content-section">
        <div className="feed-item">
          <img src={previousVisitor.image} />
          <p className="handwriting">{previousVisitor.note}</p>
          <p className="handwriting">- {previousVisitor.name}</p>
          <p className="handwriting date">{formatDate(previousVisitor.date)}</p>
        </div>
        <div className="feed-item">
          <img src={previousVisitor.image} />
          <p className="handwriting">{previousVisitor.note}</p>
          <p className="handwriting">- {previousVisitor.name}</p>
          <p className="handwriting date">{formatDate(previousVisitor.date)}</p>
        </div>
      </div>
    </div>
  )

  ReactDOM.render(successTemplate, appRoot)
}

let initialPageTemplate = (
  <div>
    <div className="title-section">
      <a href="http://canyou.ethercache.me"><p id="header">ethercaching</p></a>
      <img src="https://ethercaching.nyc3.digitaloceanspaces.com/unicorn.png" />
      <h1>That’s treasure!</h1>
      <p>You found me.</p>
    </div>
    <div className="content-section">
      <p>Congratulations on finding me.</p>
      <p>The person who was here before you left you a note:</p>
      <img id='previousLogImage' src='{previousVisitor.image}' />
      <p id='previousLogNote' className="handwriting">{previousVisitor.note}</p>
      <p id='previousLogName' className="handwriting">–– {previousVisitor.name}</p>
      <p>That’s adorable.</p>
      <p>Now it’s your turn to pay it forward.</p>
      <p>Let’s leave a note from you for the next person who finds me.</p>
      <button onClick={renderStepOne}>Leave a note.</button>
    </div>

  </div>
)

let getPreviousVisitor = () => {
  let previous = {}

  ethercacheContract.getNumberOfLogEntries(function(err, res) {
    ethercacheContract.visitorLogs(res - 1, function(err, res) {
      previous.name = res[1]
      previous.date = res[2]
      previous.note = res[4]
      previous.image = res[5]
      console.log(`1. in getPreviousVisitor, previous is ${previous.name}`)
      return previous
    })
    console.log(`2. in getPreviousVisitor, previous is ${previous.name}`)
    return previous
  })
  console.log(`3. in getPreviousVisitor, previous is ${previous.name}`)
  return previous
}

ReactDOM.render(initialPageTemplate, appRoot)

window.addEventListener("load", function(event) {

  let web3 = initializeWeb3()
  console.log(web3.eth.accounts)

  currentCache = getWhichEtherCache()

  ethercacheContractABI = web3.eth.contract([{"constant":false,"inputs":[],"name":"setFirstLogEntry","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_dateTime","type":"string"},{"name":"_location","type":"string"},{"name":"_note","type":"string"},{"name":"_imageUrl","type":"string"}],"name":"createLog","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"visitorLogs","outputs":[{"name":"visitor","type":"address"},{"name":"name","type":"string"},{"name":"dateTime","type":"string"},{"name":"location","type":"string"},{"name":"note","type":"string"},{"name":"imageUrl","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfLogEntries","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}])

  ethercacheContract = ethercacheContractABI.at('0xc1297d9bda529c5e02685a2a3862ce9b82fc5257')

  previousVisitor = getPreviousVisitor()

  setTimeout(function() {

    document.getElementById('previousLogImage').src = previousVisitor.image
    document.getElementById('previousLogNote').innerHTML = previousVisitor.note
    document.getElementById('previousLogName').innerHTML = `–– ${previousVisitor.name}`

  }, 1000)

});
