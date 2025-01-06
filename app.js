const http = require('http');

// כתובת ה-Metadata Service של Azure
const METADATA_URL = 'http://169.254.169.254/metadata/instance?api-version=2021-02-01';

// אפשרויות הבקשה
const options = {
  headers: {
    'Metadata': 'true' // חובה לכלול את הכותרת הזו כדי לבצע בקשה לשירות
  }
};

// יצירת שרת HTTP
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // בקשת HTTP לשירות ה-Metadata
    http.get(METADATA_URL, options, (metadataRes) => {
      let data = '';

      // איסוף המידע מהתגובה
      metadataRes.on('data', (chunk) => {
        data += chunk;
      });

      metadataRes.on('end', () => {
        try {
          // המרת המידע מ-JSON
          const metadata = JSON.parse(data);

          // הצגת כל המידע הגולמי
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

// הרצת השרת על פורט 3000
const PORT = 80;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
