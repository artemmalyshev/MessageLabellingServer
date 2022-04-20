const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    let filePath = "";
    if (req.url === "/" || req.url === "/index") {
        filePath = path.join(__dirname, "/public/html/index.html");
    }
    else if (req.url.startsWith("/public/"))
        filePath = path.join(__dirname, req.url);
    else if (req.url.startsWith("/webfonts/"))
        filePath = path.join(__dirname, "/public/" + req.url);
    else {
        res.writeHead(404, { "Content-type": "text/html" });
        res.end(`<html><body><h1>Page not found</h1></body></html`);
        return;
    }

    let ext = path.extname(filePath);
    let contentType;
    switch (ext) {
        case ".ico":
            contentType = "image/x-icon";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".json":
            contentType = "application/json";
            break;
        case ".js":
            contentType = "text/javascript";
            break;

        default:
            contentType = "text/html";
    }

    try {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-type": "text/html" });
                res.end(`<html><body><h1>File ${filePath} not found</h1></body></html`);
            }
            else {
                res.writeHead(200, { "Content-type": contentType });
                res.end(data);
            }
        });
    }
    catch (e) {
        res.writeHead(500, { "Content-type": "text/plain" });
        res.end("unknown error");
        console.log(e);
    }
});

server.listen(3000, () => {
    console.log("сервер запущен");
})