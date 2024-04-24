const WebSocket = require('ws');
const uuid = require('uuid'); // For generating unique identifiers

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Map to store connections with unique identifiers
const clients = new Map();

wss.on('connection', (ws) => {
  
  // Assign a unique identifier to the connection
  const clientId = uuid.v4(); // UUID for unique identification
  clients.set(clientId, ws);

  console.log(`Client connected with ID: ${clientId}`);

  // Send the Client ID to the client
  ws.send(JSON.stringify({ type: 'client-id', id: clientId, message: "CONNECTING..." }));
 

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log(`Received from client ${clientId}`);
    const data = JSON.parse(message); // Assuming JSON messages
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.id: [${data.id}]`);
    console.log(`Received data.message: [${data.message}]`);
    console.log();
    

    // Broadcast the message to all connected clients
    clients.forEach((client, id) => {
      if (id !== clientId) {
        // Parse the string into a JSON object
        const jsonData = JSON.stringify({ type: data.type, id: clientId, message: data.message });
        client.send(jsonData);
      }
    });
  });

  // Handle client disconnections
  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients.delete(clientId); // Remove from the map
  });
});
