const express = require('express');//Set up the express module
const app = express();
const router = express.Router();
const path = require('path');
//const express = require('express');

//const app = express();
/*
app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

app.listen(3000, () => {
  console.log('server started');
});
*/
/*
const http = require('http')
const fs = require('fs')

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.html').pipe(res)
})

server.listen(process.env.PORT || 443)
*/


function ConsoleLog(toLog) {
  console.log(toLog);
}

router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '/index.html'));
});
router.get('/script.js', function(req, res){
  res.sendFile(path.join(__dirname, '/script.js'));
  
});
router.get('/getCommand.js', function(req, res){
  res.sendFile(path.join(__dirname, '/getCommand.js'));
  
});
app.use('/', router);

let server = app.listen(443, function(){
  console.log("App server is running on port 443");
  console.log("to end press Ctrl + C");
});