const PORT = process.env.PORT || 3002
;
const express = require('express');
const app = express();
const http = require('http');
const server = http.Server(app);
const WebSocket = require('ws');
const WSc = new WebSocket.Server({ server });
const path = require('path')
const flash = require('connect-flash')
const session = require('express-session')



app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

server.listen(PORT, () => {
    console.log('[SERVER] listening on *:' + PORT);
});

