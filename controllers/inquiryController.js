const axios = require('axios');
const Inquiry = require('../models/Inquiry');
const nodemailer = require('nodemailer');

// Set up Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @desc    Submit a new quote request
// @route   POST /api/quotes
// @access  Public
const submitInquiry = async (req, res, next) => {
  try {
    const { name, mobileNumber, requirement, email} = req.body;

    if (!name || !mobileNumber || !requirement) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    // 1. Save to MongoDB
    const newInquiry = await Inquiry.create({
      name,
      mobileNumber,
      email,
      requirement
    });

    console.log("Successfully saved to database:", newInquiry);
// 2. Send Email Notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,

      replyTo: req.body.email || process.env.EMAIL_USER, // Use the user's email if provided, else default to your email
      subject: `🚨 New Lead from ${name} for - Translite Fiber Gallery`,
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Customer:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${mobileNumber}</p>
        <p><strong>Requirement:</strong> ${requirement}</p>
        <br/>
        <p><em>Log in to your admin dashboard to view all leads.</em></p>
      `
    };

    // UNCOMMENT THIS LINE:
    await transporter.sendMail(mailOptions);

    console.log("Successfully saved to database:", newInquiry);
    res.status(201).json({ message: 'Requirement submitted successfully!', inquiry: newInquiry });

  } catch (error) {
    console.error("BACKEND CRASHED:", error.message);
    next(error); 
  }
};

// @desc    Get all quote requests (Admin)
// @route   GET /api/quotes
// @access  Public (We will add authentication later)
const getInquiries = async (req, res, next) => {
  try {
    // Fetch all leads, sorted by newest first
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status (Admin)
// @route   PUT /api/quotes/:id
// @access  Public
const updateInquiryStatus = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      res.status(404);
      throw new Error('Inquiry not found');
    }

    // Toggle status between 'Pending' and 'Contacted'
    inquiry.status = req.body.status;
    const updatedInquiry = await inquiry.save();

    res.status(200).json(updatedInquiry);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitInquiry,
  getInquiries,        // <--- Add this
  updateInquiryStatus  // <--- Add this
};