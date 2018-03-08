var barista = (url, key) => {

var getSpeechElement = attr => document.querySelector('[data-speech="' + attr + '"]');

var speechList = getSpeechElement('list');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Ears = new SpeechRecognition();

const Mouth = window.speechSynthesis || window.webkitSpeechSynthesis;

var createSpeechNode = text => {
  var p = document.createElement('p');
  p.textContent = text;

  return p;
}

var createUtterance = text => {
  var utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = e => {
    var event = new CustomEvent('utteranceend');
    utterance.dispatchEvent(event);
  };
  return utterance;
}

var sendSpeech = text => {
  return fetch(url + 'query', {
    method: 'post',
    body: JSON.stringify({query:text, sessionId:key}),
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    })
  }).then(data => data.json());
}

Ears.start();

Ears.addEventListener('result', e => {
  var transcript = e.results[0][0].transcript;

  var node = createSpeechNode(transcript);
  speechList.appendChild(node);
});

Ears.addEventListener('end', e => {
  var utterance = createUtterance('I heard you!');
  Mouth.speak(utterance);
});

Ears.addEventListener('utteranceend', e => {
  console.log('Barista finished speaking');
  Ears.start();
});

}

var Barista = barista('https://api.api.ai/v1/', '07eb6b0235874116be00534f1076e04f');