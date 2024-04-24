//http://localhost:3000/

const express = require('express'); // Import Express
const net = require('net'); // Import the net package for TCP connections

const app = express(); // Create an Express application
const port = 3000; // Port for the Express server to listen on

// TCP server details
const tcpServerHost = '127.0.0.1'; // Host of the TCP server
const tcpServerPort = 5000; // Port to connect to

// Function to write to TCP server
function writeToTCPServer(message) {
    const client = new net.Socket();

    console.log('Inside the writeToTCPServer');


    client.connect(tcpServerPort, tcpServerHost, () => {
        console.log('Connected to TCP server');
        client.write(message); // Send the message to the TCP server
    });

    client.on('data', (data) => {
        console.log('Received from TCP server:', data.toString());
        client.destroy(); // Close the connection
    });

    client.on('close', () => {
        console.log('TCP connection closed');
    });

    client.on('error', (err) => {
        console.error('TCP error:', err.message);
    });
}

// Example route that triggers the TCP client
app.get('/send-tcp', (req, res) => {
    const message = 'Hello from Express. Triggered from send-tcp EndPoint';
    writeToTCPServer(message); // Send a message to the TCP server
    res.send('Message sent to TCP server');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});


// const PORT = 3001;
// server.listen(PORT, () => {
    // console.log('Server listening on port', PORT);
// });
