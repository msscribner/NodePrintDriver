const net = require('net');

// Create a TCP server
const server = net.createServer((socket) => {
    console.log('Client connected to TCP server.');

    // Send a welcome message when a client connects
    socket.write('Test Test Test Welcome to the Node.js TCP server!');
    console.log('Test Test Test Welcome to the Node.js TCP server!');    


    socket.on('data', (data) => {
        console.log(`Received data: ${data}`);
    });

    socket.on('end', () => {
        console.log('Client disconnected from TCP server.');
    });
});

// Listen on port 8080 (can be changed)
server.listen(8080, () => {
    console.log('TCP server listening on port 8080');
});
