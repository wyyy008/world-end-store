// Dependency-free, loopback-only server for reproducing the contest browser checks.
const {createServer} = require("node:http");
const {createReadStream, stat} = require("node:fs");
const {resolve, extname, sep} = require("node:path");

const root = resolve(__dirname, "..");
const types = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".svg": "image/svg+xml",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".wav": "audio/wav", ".mp3": "audio/mpeg", ".woff2": "font/woff2"
};

createServer((request, response) => {
  let path;
  try {
    path = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  if (path === "/") path = "/index.html";
  if (!/^\/(?:index\.html|[a-z-]+\.(?:css|js)|assets\/[\w./-]+)$/.test(path) || path.split("/").some(part => part.startsWith("."))) {
    response.writeHead(404).end();
    return;
  }
  const file = resolve(root, "." + path);
  const type = types[extname(file).toLowerCase()];
  if (!file.startsWith(root + sep) || !type || !["GET", "HEAD"].includes(request.method)) {
    response.writeHead(404).end();
    return;
  }
  stat(file, (error, info) => {
    if (error || !info.isFile()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, {"Content-Type": type, "Content-Length": info.size, "Cache-Control": "no-store"});
    if (request.method === "HEAD") { response.end(); return; }
    const stream = createReadStream(file);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  });
}).listen(8765, "127.0.0.1", () => console.log("Open http://127.0.0.1:8765/"));
