const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'dist');
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
};

http.createServer((request, response) => {
  const pathname = request.url === '/' ? '/index.html' : request.url.split('?')[0];
  const filePath = path.join(root, pathname);
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
    response.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173'));
