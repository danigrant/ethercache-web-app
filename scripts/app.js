'use strict';

// @dev next steps:
// 1 - styling
// 2 - initialize web3 and contract, pass in contract address as qs and set = to that contract based on qs
// 3 - send to contract and get past data based on contract
// 4 - deploy and test on mobile

var appRoot = document.getElementById('app');

// TODO initialize web3

// TODO figure out which cache it is based on querystring
// play.ethercache.me?x={addr}

var getWhichEtherCache = function getWhichEtherCache() {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == 'x') {
      // TODO if x = a, return 'prague'. if x = b, return 'shanghai'
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Ethercache addr not found in querystring');
};

// TODO fetch previous image and note, store them in vars prevImage, prevNote, prevName

var prevImage = 'https://ucarecdn.com/6eb309a7-60bb-46e7-9328-ea43655a314b/c9ca93944a2f77fa0831014202f245de.png';
var prevNote = 'This is fun! Hope you have as much fun as I did.';
var prevName = 'dani';
var prevDate = '2018-08-13T03:24:00';

var formatDate = function formatDate() {
  var date = new Date(prevDate);
  return date.getMonth() + 1 + ' ' + date.getDate() + ', ' + date.getFullYear();
};

// show initial page
// TODO but if no web3 address, ask them to login with cipher

var currentVisitor = {
  name: '',
  message: '',
  imageUrl: ''
};

var renderStepOne = function renderStepOne() {
  var stepOneTemplate = React.createElement(
    'div',
    { className: 'form-section' },
    React.createElement(
      'form',
      { onSubmit: nameFormSubmit },
      React.createElement(
        'label',
        null,
        'First, tell me your name.'
      ),
      React.createElement('input', { type: 'text', name: 'namefield', autoFocus: true, required: true, placeholder: 'dani' })
    )
  );

  ReactDOM.render(stepOneTemplate, appRoot);
};

var nameFormSubmit = function nameFormSubmit(e) {
  e.preventDefault();
  currentVisitor.name = e.target.elements.namefield.value;
  e.target.elements.namefield.value = '';

  renderStepTwo();
};

var renderStepTwo = function renderStepTwo(e) {
  var stepTwoTemplate = React.createElement(
    'div',
    { className: 'form-section' },
    React.createElement(
      'form',
      { onSubmit: messageFormSubmit },
      React.createElement(
        'label',
        null,
        'Now let\u2019s write a little letter to whomever finds me next.'
      ),
      React.createElement('input', { type: 'text', name: 'messagefield', autoFocus: true, required: true, placeholder: 'i am so happy to share my day with you' })
    )
  );

  ReactDOM.render(stepTwoTemplate, appRoot);
};

var messageFormSubmit = function messageFormSubmit(e) {
  e.preventDefault();
  currentVisitor.message = e.target.elements.messagefield.value;
  e.target.elements.messagefield.value = '';

  renderStepThree();
};

var renderStepThree = function renderStepThree() {
  var stepThreeTemplate = React.createElement(
    'div',
    { className: 'form-section' },
    React.createElement(
      'form',
      { onSubmit: photoFormSubmit },
      React.createElement(
        'label',
        null,
        'This is the last step. Let\u2019s take a picture to commemorate the moment.'
      ),
      React.createElement('input', { type: 'hidden', role: 'uploadcare-uploader', name: 'content', 'data-crop': '1:1', 'data-images-only': 'true' })
    )
  );

  ReactDOM.render(stepThreeTemplate, appRoot);

  pollForPhoto();
};

var pollForPhoto = function pollForPhoto() {
  if (document.getElementsByName('content').length !== 0) {
    if (document.getElementsByName('content')[0].value !== "") {
      photoFormSubmit();
    }
  }
  setTimeout(pollForPhoto, 1000);
};

var photoFormSubmit = function photoFormSubmit() {
  currentVisitor.imageUrl = document.getElementsByName('content')[0].value;
  document.getElementsByClassName('uploadcare--widget__text')[0].innerHTML = '';

  renderStepFour();
};

var renderStepFour = function renderStepFour() {
  var stepFourTemplate = React.createElement(
    'div',
    { className: 'form-section' },
    React.createElement(
      'form',
      { onSubmit: sendToEther },
      React.createElement(
        'label',
        null,
        'You\u2019re a pro. Now hit send to become a part of the ethercache legend.'
      ),
      React.createElement(
        'button',
        { type: 'submit' },
        'Send Me To The Ether'
      )
    )
  );

  ReactDOM.render(stepFourTemplate, appRoot);
};

var sendToEther = function sendToEther(e) {
  e.preventDefault();
  console.log('sent!');

  // send to web3 contract then display success screen

  renderSuccessScreen();
};

var renderSuccessScreen = function renderSuccessScreen() {
  var successTemplate = React.createElement(
    'div',
    { className: 'success-section' },
    React.createElement(
      'div',
      { className: 'title-section' },
      React.createElement(
        'h1',
        null,
        'You\u2019re done!'
      ),
      React.createElement(
        'h1',
        null,
        'You\u2019ve left your mark on history.'
      ),
      React.createElement(
        'h2',
        null,
        'Scroll down to read messages from past visitors.'
      )
    ),
    React.createElement(
      'div',
      { className: 'content-section' },
      '/* TODO - fill in past visitor messages content = new func render feed. Get length of pastmessages array. then loop through and get each value. then format it into the feed. */',
      React.createElement(
        'div',
        { className: 'feed-item' },
        React.createElement('img', { src: prevImage }),
        React.createElement(
          'p',
          { className: 'handwriting' },
          prevNote
        ),
        React.createElement(
          'p',
          { className: 'handwriting' },
          '- ',
          prevName
        ),
        React.createElement(
          'p',
          { className: 'handwriting date' },
          formatDate
        )
      ),
      React.createElement(
        'div',
        { className: 'feed-item' },
        React.createElement('img', { src: prevImage }),
        React.createElement(
          'p',
          { className: 'handwriting' },
          prevNote
        ),
        React.createElement(
          'p',
          { className: 'handwriting' },
          '- ',
          prevName
        ),
        React.createElement(
          'p',
          { className: 'handwriting date' },
          formatDate
        )
      )
    )
  );

  ReactDOM.render(successTemplate, appRoot);
};

var initialPageTemplate = React.createElement(
  'div',
  null,
  React.createElement(
    'div',
    { className: 'title-section' },
    React.createElement(
      'a',
      { href: 'http://canyou.ethercache.me' },
      React.createElement(
        'p',
        { id: 'header' },
        'ethercaching'
      )
    ),
    React.createElement('img', { src: 'https://ethercaching.nyc3.digitaloceanspaces.com/unicorn.png' }),
    React.createElement(
      'h1',
      null,
      'That\u2019s treasure!'
    ),
    React.createElement(
      'p',
      null,
      'You found me.'
    )
  ),
  React.createElement(
    'div',
    { id: 'content-section' },
    React.createElement(
      'p',
      null,
      'Congratulations on finding me.'
    ),
    React.createElement(
      'p',
      null,
      'The person who was here before you left you a note:'
    ),
    React.createElement('img', { src: prevImage }),
    React.createElement(
      'p',
      { className: 'handwriting' },
      prevNote
    ),
    React.createElement(
      'p',
      { className: 'handwriting' },
      '-',
      prevName
    ),
    React.createElement(
      'p',
      null,
      'That\u2019s adorable.'
    ),
    React.createElement(
      'p',
      null,
      'Now it\u2019s your turn to pay it forward.'
    ),
    React.createElement(
      'p',
      null,
      'Let\u2019s leave a note from you for the next person who finds me.'
    ),
    React.createElement(
      'button',
      { onClick: renderStepOne },
      'Leave a note.'
    )
  )
);

ReactDOM.render(initialPageTemplate, appRoot);
