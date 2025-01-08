const http = require('http');

const METADATA_URL = 'http://169.254.169.254/metadata/instance?api-version=2021-02-01';

const options = {
  headers: {
    'Metadata': 'true' 
  }
};

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    http.get(METADATA_URL, options, (metadataRes) => {
      let data = '';

      metadataRes.on('data', (chunk) => {
        data += chunk;
      });

      metadataRes.on('end', () => {
        try {
          const metadata = JSON.parse(data);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(metadata, null, 2)); // פורמט יפה
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error parsing metadata');
        }
      });
    }).on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error connecting to Azure Metadata Service');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 80;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
