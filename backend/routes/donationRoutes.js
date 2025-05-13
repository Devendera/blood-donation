const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const verifyToken = require('../middleware/authMiddleware'); // Import middleware

router.post('/register', verifyToken, donationController.registerDonation);
// Get all donations (protected)
router.get('/all', verifyToken, donationController.getAllDonations);

// Get donor's phone number by donation ID
router.get('/phone/:id', verifyToken, donationController.getDonorPhone);


module.exports = router;
