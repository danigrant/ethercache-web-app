let appRoot = document.getElementById('app')

// TODO initialize web3

// TODO figure out which cache it is based on querystring
// play.ethercache.me?x={addr}

// TODO fetch previous image and note, store them in vars prevImage, prevNote, prevName

let prevImage = 'https://ucarecdn.com/6eb309a7-60bb-46e7-9328-ea43655a314b/c9ca93944a2f77fa0831014202f245de.png'
let prevNote = 'This is fun! Hope you have as much fun as I did.'
let prevName = 'dani'
let prevDate = '2018-08-13T03:24:00'

let formatDate = () => {
  let date = new Date(prevDate)
  return `${date.getMonth() + 1} ${date.getDate()}, ${date.getFullYear()}`
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
        <input type="text" name="messagefield" autoFocus required placeholder="i am so happy to share my day with you" />
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
        /* TODO - fill in past visitor messages
         content = new func render feed. Get length of pastmessages array. then loop through and get each value. then format it into the feed. */
        <div className="feed-item">
          <img src={prevImage} />
          <p className="handwriting">{prevNote}</p>
          <p className="handwriting">- {prevName}</p>
          <p className="handwriting date">{formatDate}</p>
        </div>
        <div className="feed-item">
          <img src={prevImage} />
          <p className="handwriting">{prevNote}</p>
          <p className="handwriting">- {prevName}</p>
          <p className="handwriting date">{formatDate}</p>
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
    <div id="content-section">
      <p>Congratulations on finding me.</p>
      <p>The person who was here before you left you a note:</p>
      <img src={prevImage} />
      <p className="handwriting">{prevNote}</p>
      <p className="handwriting">-{prevName}</p>
      <p>That’s adorable.</p>
      <p>Now it’s your turn to pay it forward.</p>
      <p>Let’s leave a note from you for the next person who finds me.</p>
      <button onClick={renderStepOne}>Leave a note.</button>
    </div>

  </div>
)

ReactDOM.render(initialPageTemplate, appRoot)
