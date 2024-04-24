const express = require('express');
const net = require('net');

const app = express();
const port = 3000;
let counter = 0; // Initialize the loop counter


// Create a TCP client to connect to the TCP server
const tcpClient = new net.Socket();
tcpClient.connect(8080, '127.0.0.1', () => {
    console.log('Connected to the TCP server (127.0.0.1:8080)');
});

app.get('/trigger', (req, res) => {
    counter++;
    const message = 'The [trigger] endpoint was encountered (' + counter + ')'; // Message with loop counter
    console.log(message);

    // Send a message to the TCP server when this endpoint is triggered
    tcpClient.write(message);

    res.send('Message sent to TCP server.');
});



// Handle data received from the server
tcpClient.on('data', (data) => {
  console.log(`Received from server: ${data}`);
//  tcpClient.destroy(); // Close the connection after receiving the response
});

// Handle client disconnection
tcpClient.on('close', () => {
  console.log('Connection closed');
});

// Handle client errors
tcpClient.on('error', (err) => {
  console.error(`Client error: ${err}`);
});



app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});
