const ipp = require('ipp');
const express = require('express');
const fs = require('fs');
const net = require('net');


// Initialize Express app
const app = express();


const server = net.createServer(socket => {
    console.log('Client connected');

    // Handle incoming data from the client
    socket.on('data', data => {
        console.log('Received:', data.toString());

        // Echo the received data back to the client
        socket.write('Echo: ' + data.toString());
    });

    // Handle client disconnection
    socket.on('end', () => {
        console.log('Client disconnected');
    });
});


// TCP server details
const tcpServerHost = '127.0.0.1'; // Host of the TCP server
const tcpServerPort = 3001; // Port to connect to

// Function to write to TCP server
function writeToTCPServer(message) {
    const client = new net.Socket();

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


// Function to generate printer attributes response
function getPrinterAttributes(requestId) {
    const printerUriSupported = 'http://localhost:3000/ipp/print';
    const printerName = 'My Node.js IPP Printer';
    const documentFormats = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];

    const data = {
        statusCode: 'successful-ok',
        version: '2.0',  // This should be a string and represent the version as '2.0'
        id: requestId,
        'operation-attributes-tag': {
            'attributes-charset': 'utf-8',
            'attributes-natural-language': 'en-us',
            'status-message': 'successful-ok'
        },
        'printer-attributes-tag': {
            'printer-uri-supported': printerUriSupported,
            'printer-uuid': 'urn:uuid:12345678-1234-1234-1234-123456789012', // Unique printer UUID
            'printer-info': 'My Node.js IPP Printer', // Description of the printer
            'printer-more-info': 'https://example.com/printer-info', // URL for more information
            'printer-location': 'Office', // Physical location of the printer
            'uri-security-supported': ['none', 'tls'], // Security protocols supported
            'uri-authentication-supported': ['none', 'basic', 'digest'], // Authentication methods supported
            'printer-name': printerName,
            'printer-state': 3, // 3 = idle, 4 = processing, 5 = stopped
            'printer-state-reasons': ['none'], // 'none' if no issues
            'ipp-versions-supported': ['1.1', '2.0'], // Supported IPP versions
            'operations-supported': [0x02, 0x04, 0x09, 0x0B], // Numeric codes for operations, e.g., Print-Job, Get-Printer-Attributes, etc.
            'charset-configured': 'utf-8',
            'charset-supported': ['utf-8'],
            'natural-language-configured': 'en-us',
            'generated-natural-language-supported': ['en-us'],
            'document-format-supported': documentFormats,
            'printer-is-accepting-jobs': true,
            'queued-job-count': 0,
            'pdl-override-supported': 'not-attempted',
            'compression-supported': ['none', 'gzip', 'deflate'],
            'media-supported': ['iso_a4_210x297mm', 'na_letter_8.5x11in'], // Example media sizes
            'media-type-supported': ['stationery', 'transparency'], // Example media types
            //'document-format-default': 'application/pdf', // Default document format
            //'document-format-preferred': 'application/pdf', // Preferred document format
            //'media-default': 'iso_a4_210x297mm', // Default media size
            //'media-ready': ['iso_a4_210x297mm', 'na_letter_8.5x11in'], // Media sizes currently ready for use
            'print-quality-supported': [3, 4, 5], // 3 = draft, 4 = normal, 5 = high
            'sides-supported': ['one-sided', 'two-sided-long-edge', 'two-sided-short-edge'], // Supported sides
            'orientation-requested-supported': [3, 4, 5, 6], // 3 = portrait, 4 = landscape, etc.
            // 'resolution-supported': ['600x600dpi', '1200x1200dpi'], // Supported resolutions
            'copies-supported': '1-999', // Range of supported copy counts
        }
    };
    //console.log("Serializing Starting");
    return ipp.serialize(data);
}

app.get('/document', (req, res) => {
  // Get complete list of users
  const usersList = ['hello world'];

  // Send the usersList as a response to the client
  res.send(usersList);
});

// IPP server endpoint
app.post('/ipp/print', (req, res) => {
    let data = [];

    console.log('********************************IPP request received')

    req.on('data', chunk => {
        data.push(chunk);
    });

    req.on('end', () => {
        // Concatenate all chunks to get the complete data
        data = Buffer.concat(data);

        // Process the IPP request
        const ippReq = ipp.parse(data);

        console.log('IPP Request:', ippReq);

        // Check the type of IPP request
        // For simplicity, we assume 'print-job' for printing and 'get-printer-attributes' for querying printer details
        const operation = ippReq.operation || '';
        res.header('Content-Type', 'application/ipp');
        switch (operation) {
            case 'Validate-Job':
                console.log('Validate-Job request received');
                // Perform validation based on the job-attributes-tag and respond
                // For simplicity, assuming all jobs are acceptable here
                const validateResponse = ipp.serialize({
                    version: '2.0',
                    statusCode: 'successful-ok',
                    id: ippReq.id,
                    'operation-attributes-tag': {
                        'attributes-charset': 'utf-8',
                        'attributes-natural-language': 'en',
                    }
                });
                return res.send(validateResponse);
            case 'Get-Printer-Attributes':
                // Respond with printer attributes
                console.log('Get-Printer-Attributes request received');
                const response = getPrinterAttributes(ippReq.id);
                //console.log('Sending printer attributes response:', response.toString('hex'), response);
                return res.send(response);

            case 'Print-Job':
                console.log('Print-Job request received');
                
                writeToTCPServer('Print-Job request received'); // Send a message to the TCP server                
            
                // Access the document-format from the operation-attributes-tag
                const documentFormat = ippReq['operation-attributes-tag']['document-format'] || 'unknown';
                console.log('Print-Job request received for document format:', documentFormat);
            
                // Assuming `data` contains the actual document content
                if (data.length > 0) {
                    const filePath = `output.${documentFormat === 'application/pdf' ? 'pdf' : 'txt'}`;
                    
                    fs.writeFile(filePath, data, (err) => {
                        if (err) {
                            console.error('Error saving the file:', err);
                            res.status(500).send('Error processing the document');
                            return;
                        }
            
                        console.log('Saved document as', filePath);
                        res.status(200).send('Document processed successfully');
                    });
                } else {
                    console.error('No document data received');
                    res.status(400).send('Invalid IPP request');
                }
                break;
                

            default:
                // Handle other operations or respond with an error/status
                console.error('Unsupported IPP operation:', operation);
                res.status(501).send('Unsupported IPP operation');
        }
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`IPP server running at http://localhost:${port}`);
});


const PORT = 3001;
server.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});
