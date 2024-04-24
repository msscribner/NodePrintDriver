const net = require('net');

// Define server port and host
const PORT = 5000;
const HOST = '127.0.0.1';

// Create a TCP server
const server = net.createServer((socket) => {
    let counter = 0; // Initialize the loop counter

    console.log('Client connected');

    // Send a welcome message when a client connects
    socket.write('Welcome to the Node.js TCP server!');

    // Periodically send messages to connected clients
    // const interval = setInterval(() => {
        // counter++;
        // const message = 'Hello from TCP_SERVER.js! ' + counter; // Message with loop counter
          
        // console.log(message);

        // socket.write(message);
    // }, 5000); // Send a message every 5 seconds
    
    
    const message = 'Hello from TCP_SERVER.js! ' + counter; // Message with loop counter
    console.log(message);
    

    // Handle data received from the client
    socket.on('data', (data) => {
        console.log('Received from client:', data.toString());
    });

    // Handle client disconnection
    socket.on('end', () => {
//        clearInterval(interval);
        console.log('Client disconnected');
    });

    // Handle errors
    socket.on('error', (err) => {
        console.error('Socket error:', err.message);
    });
});

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`TCP server listening on ${HOST}:${PORT}`);
});
