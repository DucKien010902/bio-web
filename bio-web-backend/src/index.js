const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app); // tạo server http
const io = new Server(server, {
  cors: {
    origin: 'http://genapp.vn',
  },
});
io.on('connection', (socket) => {
  // console.log('Socket is On');
  socket.on('send_message', (message) => {
    console.log(message.content);
    io.emit('feed_back', { content: 'Okela' });
  });
});
const db = require('./config/db/index');
db.connect();
const cors = require('cors');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

const route = require('./routes/index');
route(app);
server.listen(5001, '0.0.0.0');
