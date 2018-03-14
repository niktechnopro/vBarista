var barista = (url, key) => {

var app = document.querySelector('[data-speech="app"]');

var getSpeechElement = attr => app.querySelector('[data-speech="' + attr + '"]');
var speechList = getSpeechElement('list');

var utterance;
var shouldContinue = false;

var microphone = () => {
  var icon = getSpeechElement('icon');

  var start = () => {
    icon.classList.add('active');
  }

  var stop = () => {
    icon.classList.remove('active');
  }

  return {
    start,
    stop
  };
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const Ears = new SpeechRecognition();
const Mouth = window.speechSynthesis || window.webkitSpeechSynthesis;
const Microphone = microphone();

var createSpeechNode = text => {
  var p = document.createElement('p');
  p.textContent = text;
  speechList.appendChild(p);

  return p;
}

var speak = text => {
  return new Promise((resolve,reject) => {
    var newUtterance = new SpeechSynthesisUtterance(text);
    utterance = newUtterance;
    Mouth.speak(utterance);

    utterance.onstart = e => {
      console.log('Started speaking');
    }

    utterance.onend = e => {
      console.log('Stopped speaking');
      resolve();
    }

    utterance.onerror = e => {
      console.log(e);
      reject();
    }
  });
}

var listen = (phrase) => {
  return new Promise((resolve,reject) => {
    Ears.start();
    Ears.onstart = e => {
      Microphone.start();
    }

    Ears.onresult = e => {
      console.log('Got a result');
      var transcript = e.results[0][0].transcript;
      var reply = 'Okay';

      createSpeechNode(transcript);

      if (!shouldContinue) {
        if (transcript === 'hey') {
          shouldContinue = true;
          reply = 'Hello, my name is Barista. What can I get for you today?';
        } else {
          reply = 'Say "hey" to get started.';
        }
      } else if (transcript === 'done') {
        shouldContinue = false;
        reject();
      }
      resolve(reply);
    }

    Ears.onend = e => {
      Microphone.stop();
    }

    Ears.onerror = e => {
      reject();
    }
  });
}

// var deliver = text => {
//   return fetch(url + 'query', {
//     method: 'post',
//     body: JSON.stringify({query:text, sessionId:key}),
//     headers: new Headers({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${key}`
//     })
//   }).then(data => data.json());
// }

var converse = async () => {
  while (true) {
    var reply = await listen();
    await speak(reply);
  }
}

return {
  start: converse
}

}

var Barista = barista('https://api.api.ai/v1/', '07eb6b0235874116be00534f1076e04f');

Barista.start();