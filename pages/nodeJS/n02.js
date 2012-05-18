
var http = require('http');
var counter =0;
http.createServer(function (req, res) {
counter ++;
console.log('get a request ! ' + counter );

  res.writeHead(200, {'Content-Type': 'application/json'});

  res.write(JSON.stringify({ a:1, b:2, c:444 }, null, 4));
  res.end();
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
