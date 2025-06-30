const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);

// ✅ Cấu hình chính xác CORS (áp dụng cho cả Socket.IO lẫn Express)
const allowedOrigins = ['https://genapp.vn', 'http://localhost:3000'];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ✅ Socket.IO cấu hình khớp với CORS trên
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO handler
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('send_message', (message) => {
    console.log(message.content);
    io.emit('feed_back', { content: 'Okela' });
  });
});

// Kết nối database
const db = require('./config/db/index');
db.connect();

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
const route = require('./routes/index');
route(app);

// Start server
server.listen(5001, '0.0.0.0', () => {
  console.log('Server running on http://localhost:5001');
});
