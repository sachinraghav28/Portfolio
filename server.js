// ============================================
// ADVANCED REAL-TIME PORTFOLIO SERVER
// ============================================

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ============================================
// REAL-TIME CHAT WITH SOCKET.IO
// ============================================
let userCount = 0;
const messageHistory = [];
const MAX_MESSAGES = 100;

io.on('connection', (socket) => {
  userCount++;
  console.log(`[${new Date().toLocaleTimeString()}] User connected. Total: ${userCount}`);
  io.emit('user count', userCount);
  socket.emit('load messages', messageHistory);
  
  socket.on('chat message', (msg) => {
    try {
      if (!msg || !msg.text || typeof msg.text !== 'string') {
        socket.emit('error', 'Invalid message format');
        return;
      }
      
      const text = msg.text.trim().substring(0, 200);
      if (text.length === 0) return;
      
      const chatMessage = {
        text: text,
        timestamp: msg.timestamp || new Date().toLocaleTimeString(),
        id: Date.now(),
        userId: socket.id.substring(0, 8)
      };
      
      messageHistory.push(chatMessage);
      if (messageHistory.length > MAX_MESSAGES) {
        messageHistory.shift();
      }
      
      io.emit('chat message', chatMessage);
      console.log(`[Message] ${socket.id}: ${text}`);
    } catch (err) {
      console.error('Chat message error:', err);
      socket.emit('error', 'Failed to process message');
    }
  });
  
  socket.on('disconnect', () => {
    userCount--;
    io.emit('user count', userCount);
    console.log(`[${new Date().toLocaleTimeString()}] User disconnected. Total: ${userCount}`);
  });
  
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

// ============================================
// EMAIL CONFIGURATION
// ============================================
let transporter;

try {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your.email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your_gmail_app_password'
    }
  });
  
  transporter.verify((err, success) => {
    if (err) {
      console.warn('Email transporter verification failed:', err.message);
    } else {
      console.log('Email service ready!');
    }
  });
} catch (err) {
  console.warn('Email configuration error:', err.message);
}

// ============================================
// EMAIL SENDING ENDPOINT
// ============================================
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, message'
      });
    }
    
    const sanitizedName = String(name).trim().substring(0, 100);
    const sanitizedEmail = String(email).trim().toLowerCase();
    const sanitizedMessage = String(message).trim().substring(0, 5000);
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    if (sanitizedName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Name must be at least 2 characters'
      });
    }
    
    if (sanitizedMessage.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Message must be at least 10 characters'
      });
    }
    
    if (!transporter) {
      console.warn('Email not sent (transporter not configured):', {
        name: sanitizedName,
        email: sanitizedEmail,
        message: sanitizedMessage
      });
      return res.json({
        success: true,
        message: 'Message received (email service not configured)'
      });
    }
    
    const recipientMail = {
      from: process.env.EMAIL_USER || 'your.email@gmail.com',
      to: 'sachinthakur28122005@gmail.com',
      subject: `New Portfolio Contact: ${sanitizedName}`,
      html: `
        <h2>New Message from Portfolio</h2>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Timestamp: ${new Date().toLocaleString()}</small></p>
      `
    };
    
    const confirmationMail = {
      from: process.env.EMAIL_USER || 'your.email@gmail.com',
      to: sanitizedEmail,
      subject: 'Thanks for reaching out - Portfolio Contact Received',
      html: `
        <h2>Hi ${sanitizedName},</h2>
        <p>Thank you for contacting me through my portfolio!</p>
        <p>I've received your message and will get back to you as soon as possible.</p>
        <hr>
        <p><strong>Your Message Summary:</strong></p>
        <p>${sanitizedMessage.substring(0, 200)}${sanitizedMessage.length > 200 ? '...' : ''}</p>
        <hr>
        <p>Best regards,<br>Sachin Raghav</p>
        <p><small><a href="${process.env.PORTFOLIO_URL || 'http://localhost:3001'}">Visit Portfolio</a></small></p>
      `
    };
    
    await transporter.sendMail(recipientMail);
    await transporter.sendMail(confirmationMail);
    
    console.log(`Email sent from: ${sanitizedEmail}`);
    
    return res.json({
      success: true,
      message: 'Email sent successfully'
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    
    let errorMessage = 'Failed to send email';
    if (error.message.includes('auth')) {
      errorMessage = 'Email authentication failed';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Email service timeout';
    }
    
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// ============================================
// API ENDPOINTS
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    users: userCount,
    messages: messageHistory.length
  });
});

app.get('/api/messages', (req, res) => {
  res.json({
    messages: messageHistory.slice(-50),
    total: messageHistory.length
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    activeUsers: userCount,
    totalMessages: messageHistory.length,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// ERROR HANDLING & 404
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

// ============================================
// SERVER STARTUP
// ============================================
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   ADVANCED PORTFOLIO SERVER RUNNING    ║');
  console.log('╠════════════════════════════════════════╣');
  console.log(`║  Port: ${PORT.toString().padEnd(35)}║`);
  console.log(`║  Environment: ${(process.env.NODE_ENV || 'development').padEnd(28)}║`);
  console.log('║  Features:                             ║');
  console.log('║  ✓ Real-time Chat (Socket.IO)          ║');
  console.log('║  ✓ Email Integration (Nodemailer)     ║');
  console.log('║  ✓ Advanced Animations                 ║');
  console.log('║  ✓ Dark Mode Support                   ║');
  console.log('║  ✓ Responsive Design                   ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  console.log(`Server started: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
