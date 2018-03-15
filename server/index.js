const http = require('http');
const path = require('path');
const express = require('express');
const apiai = require('apiai');
const router = express.Router();
const app = express();
const server = http.createServer(app);
const port = 3000;
const bodyParser = require('body-parser'); //to parse post
// request through body
const webSocketServer = require('ws').Server;
//sockets use their own protocol - ws, instead of http;
//server portion

wss = new webSocketServer({port: 8080});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')));
app.use(router);


// var options = {
//     secure: false
// };

const apps = apiai('a27ab2ad6f1b4912a800447c091bba46')//, options);

//I had to plug in dialog flow code inside ws connection to make it work
//at least for now
wss.on('connection', function(ws){ //this is a listener for new connection
	//where (ws) is an individual socket connection
	var resp;	
	//the following will send connection back to client
	ws.send("Welcome to websockets")

	ws.on('message', function(message){
		console.log('received: ', message);
		var request = apps.textRequest(message, {
		sessionId: '07eb6b0235874116be00534f1076e04f' //developer
		});

		request.on('response', function(response){
			// console.log(response.result.fulfillment.speech);
			resp = response.result.fulfillment.speech;
		});
		
		if (resp){
			console.log('resp here', resp)
			ws.send(resp)
		}

		request.on('error', function(error){
			console.log(error)
		});

		request.end()
	})

	ws.on('close', function(){//if we loose connection
		console.log("we lost a client")
	})

	console.log('client connected');//every connection of ws is independent
})


server.listen(port, error => {
  console.log('Listening on port:',port);
  if(error) {
    console.log("There's an error.");
  }
});