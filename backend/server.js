
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const orderRoutes = require('./routes/orders');
const galleryRoutes = require('./routes/gallery');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./admin/adminRoutes');
const chatRoutes = require('./routes/chat');
const errorHandler = require('./middleware/errorHandler');

app.use('/api/orders', orderRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorHandler);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

let adminOnline = false;

io.on('connection', (socket) => {
  socket.on('admin-join', () => { adminOnline = true; });
  socket.on('admin-leave', () => { adminOnline = false; });

  socket.on('user-message', async (data) => {
    if (adminOnline) {
      io.emit('admin-message', data);
    } else {
      // Dummy AI logic
      let reply = "I'm a virtual assistant. An agent will respond soon!";
      if (data.message && data.message.toLowerCase().includes('price')) {
        reply = "Our prices depend on the type of service. Can you tell me more?";
      }
      setTimeout(() => {
        io.to(socket.id).emit('bot-message', { message: reply });
      }, 2000);
    }
    // Save to DB
    const pool = require('./config/db');                                            
    await pool.query('INSERT INTO messages (sender, receiver, message) VALUES (?, ?, ?)', [data.sender, data.receiver, data.message]);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Loaded env:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'set' : 'not set',
    ADMIN_PASS: process.env.ADMIN_PASS ? 'set' : 'not set',
    JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'not set',
  });
}); 