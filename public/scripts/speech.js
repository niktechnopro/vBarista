var speaker = (url, key) => {

var getSpeechElement = attr => document.querySelector('[data-speech="' + attr + '"]');

var speechList = getSpeechElement('list');
var startBtn = getSpeechElement('start');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

const Speaker = window.speechSynthesis || window.webkitSpeechSynthesis;
const voices = Speaker.getVoices();
console.log(voices);

var createSpeechNode = text => {
  var p = document.createElement('p');
  p.textContent = text;

  return p;
}

var createUtterance = text => {
  var utterance = new SpeechSynthesisUtterance(text);
  return utterance;
}

var sendSpeech = text => {
  return fetch(url, {
    method: 'post',
    body: JSON.stringify({query:text, sessionId:'coffeerun'}),
    headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    })
  }).then(data => data.json());
}

var introduction = createUtterance('Hello, my name is Vee Barista. What can I get you today?')
Speaker.speak(introduction);

startBtn.addEventListener('click', () => recognition.start());
recognition.addEventListener('result', e => {
  var transcript = e.results[0][0].transcript;
  var node = createSpeechNode(transcript);
  speechList.appendChild(node);

  var response = sendSpeech(transcript);
  response.then(data => {
    var utterance = createUtterance('Awesome!');
    Speaker.speak(utterance);
  });
});

}

var Speaker = speaker('https://api.api.ai/v1/query', 'a27ab2ad6f1b4912a800447c091bba46');

