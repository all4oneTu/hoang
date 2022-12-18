const PORT = process.env.PORT || 3002;
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

app.get('/', async (req, res) => {
    // const query = "SELECT * FROM data ORDER BY id DESC"
    // const data = await client.query({
    //     rowMode: 'object',
    //     text: query,
    // })
    const msg = req.flash('msg')
    const type = req.flash('type')
    res.render('index', {
    //   tableData: data.rows,
    //   connected: !!arduinoClient,
      msg: msg,
      type: type
    });
});
function broadcast(socket, data) {
    let payload = {
        method: "temperature",
        value: data
    }
    for (let [key, value] of Object.entries(clients)) {
        clients[key].send(JSON.stringify(payload));
  }
}

let arduinoClient = false
let clients = []
WSc.on('connection', (socket, req) => {
    console.log(new Date() + " Connection accepted.");
    if (socket.protocol === 'arduino') {
        arduinoClient = socket
        let payload = {
            method: "connect",
            value : true
        }
        for (let [key, value] of Object.entries(clients)) {
                clients[key].send(JSON.stringify(payload));
          }
        console.log(`[WSc] ${socket.protocol} client is connected`);
    }

    clients.push(socket)
   
    socket.on('message', data => {
        broadcast(socket, data)
        temp = data.toString()
    });

    socket.on('close', () => {
        clients = clients.filter(sk => sk !== socket)
        if (socket.protocol === 'arduino') {
            arduinoClient = false
            let payload = {
                method: "connect",
                value : false
            }
            for (let [key, value] of Object.entries(clients)) {
                clients[key].send(JSON.stringify(payload));
          }
            console.log(`[WSc] ${socket.protocol} client is disconnected`);
        }
    });
});
server.listen(PORT, () => {
    console.log('[SERVER] listening on *:' + PORT);
});

