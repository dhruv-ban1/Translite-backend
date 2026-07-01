const express = require('express');
const router = express.Router();
const { submitInquiry, getInquiries, updateInquiryStatus } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware'); // <-- IMPORT THIS

// Public route (Anyone can submit a quote)
router.post('/', submitInquiry);

// Protected Admin Routes (Only logged-in users with cookies can view/update)
router.get('/', protect, getInquiries);
router.put('/:id', protect, updateInquiryStatus);

module.exports = router;