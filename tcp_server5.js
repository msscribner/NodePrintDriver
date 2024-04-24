const WebSocket = require('ws');
const uuid = require('uuid'); // For generating unique identifiers

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Map to store connections with unique identifiers
const clients = new Map();

wss.on('connection', (ws) => {
  
  // Assign a unique identifier to the connection
  const socketId = uuid.v4(); // UUID for unique identification
  clients.set(socketId, ws);

  console.log(`Client connected with ID: ${socketId}`);

  // Send the Client ID to the client
  ws.send(JSON.stringify({ appId: null, type: 'CREATEWEBSOCKET', socketId: socketId, message: "Client CONNECTED to WebSocket Server.  Returning WebSocketId..." }));
 

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log(`Received from client ${socketId}`);
    const data = JSON.parse(message); // Assuming JSON messages
    console.log(`Received data.appId: [${data.appId}]`);
    console.log(`Received data.type: [${data.type}]`);
    console.log(`Received data.socketId: [${data.socketId}]`);
    console.log(`Received data.message: [${data.message}]`);
    console.log();
    
    
    if (data.type == 'ASSOCIATEAPPWITHSOCKET') {
        // Assoicate AppId and SocketId
        console.log(`Assoicate AppId [${data.appId}] and SocketId: [${data.socketId}]`);
        
        
        clients.forEach((client, id) => {
          if (id === data.socketId) {
            // Parse the string into a JSON object
            const jsonData = JSON.stringify({ type: data.type, appId: data.appId, socketId: data.socketId, message: data.message });
            client.send(jsonData);          }
        });        

    }
    else {
        // Broadcast the message to all connected clients
        clients.forEach((client, id) => {
          if (id !== data.socketId) {
            // Parse the string into a JSON object
            const jsonData = JSON.stringify({ type: data.type, appId: data.appId, socketId: data.socketId, message: data.message });
            client.send(jsonData);
          }
        });
    }
  });

  // Handle client disconnections
  ws.on('close', () => {
    console.log(`Client ${socketId} disconnected`);
    clients.delete(socketId); // Remove from the map
  });
});
