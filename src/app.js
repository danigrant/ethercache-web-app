let appRoot = document.getElementById('app')

// initialize web3

// figure out which cache it is based on querystring

// fetch previous image and note, store them in vars prevImage, prevNote, prevName

let prevImage = 'https://ucarecdn.com/6eb309a7-60bb-46e7-9328-ea43655a314b/c9ca93944a2f77fa0831014202f245de.png'
let prevNote = 'This is fun! Hope you have as much fun as I did.'
let prevName = 'dani'

// show initial page

let initialPageTemplate = (
  <div>
    <div id="title-section">
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

let renderStepOne = () => {
  let stepOneTemplate = (

  )

  ReactDOM.render(stepOneTemplate, appRoot)
}
