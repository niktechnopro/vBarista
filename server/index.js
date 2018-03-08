const http = require('http');
const path = require('path');
const express = require('express');
const apiai = require('apiai');
const router = express.Router();
const app = express();
const uuidv1 = require('uuid/v1');
const server = http.createServer(app);
const port = 3000;
const uniqueid = uuidv1();//for random number
const bodyParser = require('body-parser'); //to parse post
// request through body



app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);

var array = ['hello', 'how are you', 'nice to meet you']
var options = {
    secure: false
};
const apps = apiai('a27ab2ad6f1b4912a800447c091bba46')//, options);


app.post('/send',(req,res)=>{
	let msg = req.body.info;
	console.log('getting data', req.body)

	var request = apps.textRequest(msg, {
		sessionId: '07eb6b0235874116be00534f1076e04f' //developer
	});

	request.on('response', function(response){
		console.log(response.result.fulfillment.speech)
		res.json({
			response
		})
	});

	request.on('error', function(error){
		console.log(error)
	});

	request.end()

});


server.listen(port, error => {
  console.log('Listening!',port);
  if(error) {
    console.log("There's an error.");
  }
});