const http = require('http');
const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({});
const ports = {
  proxy: parseInt(3000, 10),
  jekyll: parseInt(3001, 10),
  karma: parseInt(3002, 10),
  webpack: parseInt(3003, 10),
};

const server = http.createServer((req, res) => {
  if (
    /\/\d+\.\d+\.\d+/.test(req.url) ||
    req.url.startsWith('/karma/base/dist')
  ) {
    const target = `http://localhost:${ports.webpack}/${req.url
      .split('/')
      .pop()}`;
    proxy.web(req, res, {
      ignorePath: true,
      target,
    });
  } else if (
    req.url.startsWith('/karma') ||
    req.url === '/assets/favicon.png'
  ) {
    proxy.web(req, res, { ignorePath: false, target: { port: ports.karma } });
  } else {
    proxy.web(req, res, { ignorePath: false, target: { port: ports.jekyll } });
  }
});

server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

proxy.on('error', e => {
  console.error(e);
});

console.log('Proxy listening on ' + ports.proxy);
server.listen(ports.proxy);
