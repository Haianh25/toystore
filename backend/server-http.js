const http = require('http');
const app = require('./app');
const socket = require('./socket');

const server = http.createServer(app);
socket.init(server);

module.exports = server;
