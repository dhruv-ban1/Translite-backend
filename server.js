const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();

// Global Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // Adjust this to your frontend's origin
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/quotes', require('./routes/inquiryRoutes'));

// Custom Error Handler Middleware (must be after routes)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Translite Backend Server running on port ${PORT}`);
});