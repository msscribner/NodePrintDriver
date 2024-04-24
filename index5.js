const WebSocket = require('ws');
const express = require('express');
const uuid = require('uuid'); // For generating unique identifiers

const port = 3000;
let counter = 0; // Initialize the loop counter
let socketId = null;
let appId = uuid.v4(); // UUID for unique identification

// Create the App Express Server
const app = express();

// Create a WebSocket client that connects to the server on port 8080
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Send a message to the server
//  const message = JSON.stringify({ appId: appId, type: 'CLIENT-ID', socketId: socketId, message: 'The Express Client has connected!'});
//  ws.send(message);
});

ws.on('message', (message) => {
  const data = JSON.parse(message); // Assuming JSON messages
  
  console.log(`Json Received from Server: ${JSON.stringify(data, null, 2)}`);
 

  if (data.type === 'CREATEWEBSOCKET') {
    console.log(`Received AppId: [${appId}]`);      
    console.log(`Received data.appId: [${data.appId}]`);      
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.socketId: [${data.socketId}]`);
    console.log(`Received data.message: [${data.message}]`);
      
    // Store the socketId for future use
    socketId = data.socketId;
      
    const message = JSON.stringify({ appId: appId, type: 'ASSOCIATEAPPWITHSOCKET', socketId: socketId, message: ''});
    ws.send(message);
  } else
  if (data.type === 'ASSOCIATEAPPWITHSOCKET') {

    console.log(`Assoicate AppId [${data.appId}] and SocketId: [${data.socketId}]`);      
    }
  else   
  if (data.type === 'CLIENT-ID') {
    console.log(`Received data.appId: [${data.appId}]`);      
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.socketId: [${data.socketId}]`);
    console.log(`Received data.message: [${data.message}]`);

    // Store the client ID for future use
    if (data.appId === appId)
        socketId = data.socketId;
  } else
  if (data.type === 'CLIENT-EXPRESS') {
    console.log(`Received data.appId: [${data.appId}]`);      
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.socketId: [${data.socketId}]`);
    console.log(`Received data.message: [${data.message}]`);
  } else
  if (data.type === 'CLIENT-DOTNET') {
    console.log(`Received data.appId: [${data.appId}]`);      
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.socketId: [${data.socketId}]`);
    console.log(`Received data.message: [${data.message}]`);
  }
  else {
    console.log(`Received message from server: ${message}`);
  }
});

ws.on('close', () => {
  console.log('Connection closed');
});

ws.on('error', (err) => {
  console.error(`WebSocket error: ${err}`);
});



app.get('/trigger', (req, res) => {
    counter++;

    const jsonData = JSON.stringify({ appId: appId, type: 'CLIENT-EXPRESS', socketId: socketId, message: 'The [trigger] endpoint was encountered (' + counter + ')'});
  
    console.log(`Sending message [${jsonData}] from the Express App`);

    // Send a message to the TCP server when this endpoint is triggered
    ws.send(jsonData);

    res.send('Message sent to TCP server.');
});



app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});
