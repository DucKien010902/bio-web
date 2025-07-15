// server.js (đoạn code bạn gửi)
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);

// CORS …
const allowedOrigins = ['https://genapp.vn', 'http://localhost:3000'];
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
    socket.broadcast.emit('backmessage', data);
  });
});

// Kết nối DB
const db = require('./config/db/index');
db.connect();

// 👉 GỌI CRON SAU KHI DB CONNECT (hoặc ngay dưới cũng được)
const startVoucherCleaner = require('./app/controllers/voucherClearner');
startVoucherCleaner(); // ← thêm dòng này

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const route = require('./routes/index');
route(app);

server.listen(5001, '0.0.0.0', () => {
  console.log('Server running on http://localhost:5001');
});
