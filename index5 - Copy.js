const WebSocket = require('ws');
const express = require('express');

const port = 3000;
let counter = 0; // Initialize the loop counter
let clientId = null;

// Create the App Express Server
const app = express();

// Create a WebSocket client that connects to the server on port 8080
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log('Connected to WebSocket server');

  // Send a message to the server
    const message = JSON.stringify({ type: 'client-id', id: clientId, message: 'The Express Client has connected!'});
    ws.send(message);
});

ws.on('message', (message) => {
  const data = JSON.parse(message); // Assuming JSON messages
  
  console.log(`Json Received from Server: ${JSON.stringify(data, null, 2)}`);
 

  if (data.type === 'client-id') {
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.id: [${data.id}]`);
    console.log(`Received data.message: [${data.message}]`);

    // Store the client ID for future use
    if (clientId === null)
        clientId = data.id;
  }
  if (data.type === 'client-express') {
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.id: [${data.id}]`);
    console.log(`Received data.message: [${data.message}]`);
  }
  if (data.type === 'client-dotnet') {
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.id: [${data.id}]`);
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
   
    const jsonData = JSON.stringify({ type: 'client-express', id: clientId, message: 'The [trigger] endpoint was encountered (' + counter + ')' });
    console.log(`Sending message [${jsonData}] from the Express App`);

    // Send a message to the TCP server when this endpoint is triggered
    ws.send(jsonData);

    res.send('Message sent to TCP server.');
});



app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});
