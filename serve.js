/* Minimal static file server with zero dependencies. Usage: node serve.js [port] */
var http = require("http");
var fs = require("fs");
var path = require("path");

var ROOT = __dirname;
var port = Number(process.argv[2] || process.env.PORT || 8080);

var MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

var server = http.createServer(function (req, res) {
  var urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  var filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, function (err, stat) {
    if (!err && stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    fs.readFile(filePath, function (err2, data) {
      if (err2) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 - not found: " + urlPath);
        return;
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
      res.end(data);
    });
  });
});

server.listen(port, function () {
  console.log("The Free Entry Desk is running at http://localhost:" + port);
});
