var getSpeechSelector = attr => '[data-speech="' + attr + '"]';

startBtn = document.querySelector(getSpeechSelector('start'));

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

startBtn.addEventListener('click', () => recognition.start());
recognition.addEventListener('result', result => console.log(result));

