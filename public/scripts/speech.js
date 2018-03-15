//we know that Chrome supports websockets(ws use their own protocol)
const ws = new WebSocket("ws://localhost:8080");
//next we wire websockets handlers

//the following function invoked when websocket opens
ws.onopen = function(){
  console.log('websocket opened up')
  ws.send('connected')
} 

//when websocket closes
ws.onclose = function(){
  console.log('disconnected')
}

//speach portion
var speaker = () => {

  var getSpeechElement = attr => document.querySelector('[data-speech="' + attr + '"]');

  var speechList = getSpeechElement('list');
  var startBtn = getSpeechElement('start');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  const Speaker = window.speechSynthesis || window.webkitSpeechSynthesis;
  // const voices = Speaker.getVoices();


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
      ws.send(text);
      //when we recieve a message from websocket(they call it even emitting)
      return new Promise(function(resolve, reject){
        ws.onmessage = function(payload){
          console.log('message received', payload.data)
          resolve(payload.data);
        }
    })

    // return $.ajax({
    //   method: 'post',
    //   url: url,
    //   data: {info: text}
    // })
  }

  var introduction = createUtterance('What can I get you today?')
  Speaker.speak(introduction);

  startBtn.addEventListener('click', () => recognition.start());
  recognition.addEventListener('result', e => {
    var transcript = e.results[0][0].transcript;
    var node = createSpeechNode(transcript);
    speechList.appendChild(node);
    // console.log(voices);
    var response = sendSpeech(transcript);
    // console.log(response)
    response.then(data => {
      node = createSpeechNode(data);
      speechList.appendChild(node);
      var utterance = createUtterance(data);
      Speaker.speak(utterance);
    });
  });

};

var Speaker = speaker();
