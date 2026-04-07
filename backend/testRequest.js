import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/chat',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(`Status: ${res.statusCode}, Body: ${body}`));
});

req.on('error', e => console.error(`Problem with request: ${e.message}`));
req.write(JSON.stringify({ message: "hi" }));
req.end();
