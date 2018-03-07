const http = require('http');
const path = require('path');
const express = require('express');
const router = express.Router();
const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(router);
app.use(express.static(path.join(__dirname, '../public')));

server.listen(port, error => {
  console.log('Listening!');
  console.log(port);

  if(error) {
    console.log("There's an error.");
  }
});