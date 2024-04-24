const net = require('net');

// List to keep track of connected clients
const clients = [];

//
// Function to broadcast a message to all clients
//
function broadcast(message, senderSocket) {
  // Send the message to all clients except the sender
  clients.forEach((client) => {
    if (client !== senderSocket) {
      client.write(message);
    }
  });
}

//
// Create a TCP server
//
const server = net.createServer((socket) => {
  console.log('Client connected');

  // Add the new client to the list of clients
  clients.push(socket);

  // Send a welcome message to the client
  socket.write('Welcome to the TCP server!');

  // Broadcast to other clients that a new client has joined
  broadcast('A new client has joined.\n', socket);

  //
  // When the server receives data from the client, broadcast it
  //
  socket.on('data', (data) => {
    console.log('Received from client:', data.toString());

    // Broadcast the message to other clients
    broadcast(data.toString(), socket);
  });

  //
  // Handle client disconnection
  //
  socket.on('end', () => {
    console.log('Client disconnected');

    // Remove the client from the list
    const index = clients.indexOf(socket);
    if (index > -1) {
      clients.splice(index, 1);
    }

    // Notify other clients that someone has disconnected
    broadcast('A client has disconnected.\n', socket);
  });

  //
  // Handle socket errors
  //
  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});

// Bind the server to a port and start listening
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Node.js TCP Server is started.  Listening on (127.0.0.1:${PORT})`);
});

