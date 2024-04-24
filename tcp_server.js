const net = require('net'); // Import the net module for TCP communication

// Configuration for the TCP server
const PORT = 3001; // The port to listen on
const HOST = '127.0.0.1'; // The host (localhost)

// Create a TCP server
const server = net.createServer((socket) => {
    console.log('Client connected');

    // Event: When the server receives data from the client
    socket.on('data', (data) => {
        console.log('Received from client:', data.toString());

        // Optionally, echo the data back to the client
        socket.write('Echo: ' + data.toString());
    });

    // Event: When the client disconnects
    socket.on('end', () => {
        console.log('Client disconnected');
    });

    // Event: When an error occurs with the connection
    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });
});

// Start the server to listen on the specified port and host
server.listen(PORT, HOST, () => {
    console.log(`TCP server running on ${HOST}:${PORT}`);
});
