require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// CORS for frontend
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Serve uploads with proper CORS headers
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', (req,res,next) => {
  res.set('Cross-Origin-Resource-Policy','cross-origin');
  res.set('Access-Control-Allow-Origin','*');
  res.set('Access-Control-Allow-Methods','GET');
  res.set('Access-Control-Allow-Headers','Content-Type');
  next();
});

// Routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./admin/adminRoutes'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/analytics', require('./routes/analytics'));

// Error handler
app.use(require('./middleware/errorHandler'));

app.get('/api/health', (req,res) => res.json({status:'ok'}));

// Socket.io chat
let adminOnline = false;
io.on('connection', socket => {
  socket.on('admin-join', () => adminOnline = true);
  socket.on('admin-leave', () => adminOnline = false);

  socket.on('user-message', async (data) => {
    if(adminOnline) io.emit('admin-message', data);
    else {
      let reply = "I'm a virtual assistant. An agent will respond soon!";
      if(data.message?.toLowerCase().includes('price')) reply = "Our prices depend on the service type.";
      setTimeout(() => io.to(socket.id).emit('bot-message', { message: reply }), 2000);
    }

    const pool = require('./config/db');
    await pool.query('INSERT INTO messages (sender,receiver,message) VALUES (?,?,?)',
      [data.sender, data.receiver, data.message]
    );
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
