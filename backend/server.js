
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const http = require('http');
const { Server } = require("socket.io");
const User = require('./Models/userModel');


require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRoute = require('./Routes/userRoute');
const propertyRoutes = require('./Routes/propertyRoutes');
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const adminRoutes = require('./Routes/adminRoute');
const settingsRoutes = require('./Routes/settingsRoute');
const Report=require('./Models/reportModel'); 
const notificationRoutes=require('../backend/Routes/notificationRoute');


app.use('/api/users', userRoute);
app.use('/api/properties', propertyRoutes);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls:{
    rejectUnauthorized: false
  }
});
const loanRequestTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER1, 
    pass: process.env.EMAIL_PASS1, 
  },
  tls: {
    rejectUnauthorized: false,
  },
});

app.post('/api/forgot-password', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${user.resetPasswordToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      html: `Click <a href="${resetUrl}">here</a> to reset your password`,
    });

    res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Error processing request', error: error.message });
  }
});

app.post('/api/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(req.body.newPassword)) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters, one uppercase, one lowercase, and one number'
      });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
});

app.post("/api/submit-report", async (req, res) => {
  try {
    const { reason, comment, property_id } = req.body;

    if (!reason || !property_id) {
      return res.status(400).json({ error: "Reason and property ID are required" });
    }

    console.log("Creating new report:", { reason, comment, property_id }); 

    const newReport = new Report({ reason, comment, property_id });
    await newReport.save();

    console.log("Report saved successfully:", newReport);
    if (!mongoose.Types.ObjectId.isValid(property_id)) {
return res.status(400).json({ error: "Invalid property ID" });
}
    res.status(200).json({ message: "Report submitted successfully!" });
  } catch (error) {
    console.error("Error saving report:", error);
    res.status(500).json({ error: "Failed to submit report" });
  }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('user-online', (userId) => {
    io.emit('user-status', { userId, status: 'online' });
  });

  socket.on('disconnect', () => {
    io.emit('user-status', { userId: socket.userId, status: 'offline' });
    console.log('Client disconnected:', socket.id);
  });

  
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.roomId).emit('receiveMessage', data.message);
  });
});


app.post('/api/submit-loan-request', async (req, res) => {
  const { totalAmount, monthlyEMI, monthlyInterest, userEmail, propertyGuarantee } = req.body;

  try {
   
    const mailOptions = {
      from: process.env.EMAIL_USER1, 
      to: userEmail,
      subject: 'Loan Request Submitted',
      html: `
        <h2>Your Loan Request Has Been Submitted</h2>
        <p>Thank you for submitting your loan request. Below are the details you provided:</p>
        <ul>
          <li><strong>Total Loan Amount:</strong> ₹${totalAmount}</li>
          <li><strong>Monthly EMI:</strong> ₹${monthlyEMI}</li>
          <li><strong>Monthly Interest:</strong> ${monthlyInterest}%</li>
          <li><strong>Property Guarantee:</strong> ${propertyGuarantee}</li>
        </ul>
        <p>We will contact you shortly regarding your loan request. If you have any other queries, please feel free to contact us at <strong>safeloan@gmail.com</strong> or call us at <strong>+91 1234567890</strong>.</p>
        <p>Best regards,</p>
        <p><strong>SafeLoan Team</strong></p>
      `,
    };

    await loanRequestTransporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Loan request submitted successfully. Please check your email for confirmation.' });
  } catch (error) {
    console.error('Error submitting loan request:', error);
    res.status(500).json({ message: 'Error submitting loan request', error: error.message });
  }
});


const port = process.env.PORT || 5001;
const uri = process.env.ATLAS_URI;

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connection established");
    server.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  });