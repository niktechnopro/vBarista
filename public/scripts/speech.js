var barista = (url, key) => {

var getSpeechElement = attr => document.querySelector('[data-speech="' + attr + '"]');

var speechList = getSpeechElement('list');
var hasPermission = false;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Ears = new SpeechRecognition();

const Mouth = window.speechSynthesis || window.webkitSpeechSynthesis;

var createSpeechNode = text => {
  var p = document.createElement('p');
  p.textContent = text;
  speechList.appendChild(p);

  return p;
}

var speak = text => {
  return new Promise((resolve,reject) => {
    var utterance = new SpeechSynthesisUtterance(text);
    Mouth.speak(utterance);

    utterance.onend = () => {
      resolve();
    }
  });
}

var listen = () => {
  return new Promise((resolve,reject) => {
    Ears.start();
    Ears.onresult = e => {
      var transcript = e.results[0][0].transcript;
      createSpeechNode(transcript);
      if (transcript === 'hey') {
        hasPermission = true;
      }
      resolve(transcript);
    }
  });
}

var deliver = text => {
  return fetch(url + 'query', {
    method: 'post',
    body: JSON.stringify({query:text, sessionId:key}),
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    })
  }).then(data => data.json());
}

var converse = async () => {
  while(hasPermission) {
    let inquiry = await listen();
    await speak('Okay');
  }
}

listen().then(converse());

}

var Barista = barista('https://api.api.ai/v1/', '07eb6b0235874116be00534f1076e04f');