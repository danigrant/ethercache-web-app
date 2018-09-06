'use strict';

// @dev next steps:
// 1 - styling
// 2 - actually get past logs and display
// 3 - if no wallet, say something
// 4 - setup forwarding in cf. ethercache.me/1 => play.ethercache.me?x=addr. the fake qr needs to forqard to the nice-try page
// 5 - location checking 

var ethercacheContractABI = void 0;
var ethercacheContract = void 0;
var currentCache = void 0;
var previousVisitor = {};

var appRoot = document.getElementById('app');

var initializeWeb3 = function initializeWeb3() {

  if (typeof web3 !== 'undefined') {
    // Use the browser's ethereum provider
    var provider = web3.currentProvider;
    return web3;
  } else {
    return new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io"));
  }
};

var userHasEthBrowser = function userHasEthBrowser() {
  if (web3.eth.accounts[0] === undefined) {
    // user does not have a web3 account
    // will need to render a ui to go tell them to download cipher
    return false;
  } else {
    return true;
  }
};

// TODO figure out which cache it is based on querystring
// play.ethercache.me?x={addr}

var getWhichEtherCache = function getWhichEtherCache() {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == 'x') {
      // TODO if x = a, return obj currentCache.addr, currentCache.name
      var _currentCache = {};

      // test cache
      if (decodeURIComponent(pair[1]) === '0xc1297d9bda529c5e02685a2a3862ce9b82fc5257') {
        _currentCache.address = '0xc1297d9bda529c5e02685a2a3862ce9b82fc5257';
        _currentCache.name = 'test';
        return _currentCache;
      } else {
        return;
      }
    }
  }
  console.log('Ethercache addr not found in querystring');
};

var formatDate = function formatDate(date) {
  var d = new Date(date);
  return d.getMonth() + 1 + ' ' + d.getDate() + ', ' + d.getFullYear();
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
  // TODO this doesn't work
  var date = new Date();
  var formattedDate = date.toISOString();

  ethercacheContract.createLog(currentVisitor.name, formattedDate, '', currentVisitor.message, currentVisitor.imageUrl, function () {
    console.log('sent!');
  });

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
      React.createElement(
        'div',
        { className: 'feed-item' },
        React.createElement('img', { src: previousVisitor.image }),
        React.createElement(
          'p',
          { className: 'handwriting' },
          previousVisitor.note
        ),
        React.createElement(
          'p',
          { className: 'handwriting' },
          '- ',
          previousVisitor.name
        ),
        React.createElement(
          'p',
          { className: 'handwriting date' },
          formatDate(previousVisitor.date)
        )
      ),
      React.createElement(
        'div',
        { className: 'feed-item' },
        React.createElement('img', { src: previousVisitor.image }),
        React.createElement(
          'p',
          { className: 'handwriting' },
          previousVisitor.note
        ),
        React.createElement(
          'p',
          { className: 'handwriting' },
          '- ',
          previousVisitor.name
        ),
        React.createElement(
          'p',
          { className: 'handwriting date' },
          formatDate(previousVisitor.date)
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
    { className: 'content-section' },
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
    React.createElement('img', { id: 'previousLogImage', src: '{previousVisitor.image}' }),
    React.createElement(
      'p',
      { id: 'previousLogNote', className: 'handwriting' },
      previousVisitor.note
    ),
    React.createElement(
      'p',
      { id: 'previousLogName', className: 'handwriting' },
      '-',
      previousVisitor.name
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

var getPreviousVisitor = function getPreviousVisitor() {
  var previous = {};

  ethercacheContract.getNumberOfLogEntries(function (err, res) {
    ethercacheContract.visitorLogs(res - 1, function (err, res) {
      previous.name = res[1];
      previous.date = res[2];
      previous.note = res[4];
      previous.image = res[5];
      console.log('1. in getPreviousVisitor, previous is ' + previous.name);
      return previous;
    });
    console.log('2. in getPreviousVisitor, previous is ' + previous.name);
    return previous;
  });
  console.log('3. in getPreviousVisitor, previous is ' + previous.name);
  return previous;
};

ReactDOM.render(initialPageTemplate, appRoot);

window.addEventListener("load", function (event) {

  var web3 = initializeWeb3();
  console.log(web3.eth.accounts);

  currentCache = getWhichEtherCache();

  ethercacheContractABI = web3.eth.contract([{ "constant": false, "inputs": [], "name": "setFirstLogEntry", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_name", "type": "string" }, { "name": "_dateTime", "type": "string" }, { "name": "_location", "type": "string" }, { "name": "_note", "type": "string" }, { "name": "_imageUrl", "type": "string" }], "name": "createLog", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "uint256" }], "name": "visitorLogs", "outputs": [{ "name": "visitor", "type": "address" }, { "name": "name", "type": "string" }, { "name": "dateTime", "type": "string" }, { "name": "location", "type": "string" }, { "name": "note", "type": "string" }, { "name": "imageUrl", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getNumberOfLogEntries", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }]);

  ethercacheContract = ethercacheContractABI.at('0xc1297d9bda529c5e02685a2a3862ce9b82fc5257');

  previousVisitor = getPreviousVisitor();

  setTimeout(function () {

    document.getElementById('previousLogImage').src = previousVisitor.image;
    document.getElementById('previousLogNote').innerHTML = previousVisitor.note;
    document.getElementById('previousLogName').innerHTML = previousVisitor.name;
  }, 1000);
});
