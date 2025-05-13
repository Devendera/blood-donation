const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const donationController = require('../controllers/donationController');

// Admin Auth Routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Donation Registration Route
router.post('/donation/register', donationController.registerDonation);


module.exports = router;
