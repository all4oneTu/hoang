const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const WebSocket = require('ws');
const WSc = new WebSocket.Server({ server });
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')


WSc.on('connection', (socket, )