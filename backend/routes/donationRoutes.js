const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const verifyToken = require('../middleware/authMiddleware'); // Import middleware

router.post('/register', verifyToken, donationController.registerDonation);

module.exports = router;
