console.log('script loaded')
// invoke an instance of speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
// const socket = io(); //initiating socket io
// console.log(socket)

//properties to customize speech recognition
recognition.language = "en-US";
// recognition.continuous = true;
recognition.interimResults = false;

//listen to the click event to initiate speech recognition
document.querySelector('button').addEventListener('click', ()=>{
	recognition.start();	
});

// once speech recognition has started use result event to retrieve what was said as text
recognition.addEventListener('result', (e)=>{
	console.log(e);
	let last = e.results.length - 1;
	let text = e.results[last][0].transcript;
	 console.log(text)

	console.log('Confidence: ' + e.results[0][0].confidence);
	// socket.io later goes in here
	// socket.emit('chat message', text);
})
