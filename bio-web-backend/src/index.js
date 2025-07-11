const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);

// ✅ Cấu hình chính xác CORS (áp dụng cho cả Socket.IO lẫn Express)
const allowedOrigins = ['https://genapp.vn', 'http://localhost:3000'];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   })
// );
app.use(cors());
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('sendmessage', (data) => {
    console.log(data);

    // ✅ Gửi cho các client khác (KH hoặc shop khác)
    socket.broadcast.emit('backmessage', data);
  });
});

const db = require('./config/db/index');
db.connect();

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const route = require('./routes/index');
route(app);

server.listen(5001, '0.0.0.0', () => {
  console.log('Server running on http://localhost:5001');
});
