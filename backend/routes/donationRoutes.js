const express = require('express');
const router = express.Router();
const donationEventController = require('../controllers/donationEventController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/events', verifyToken, donationEventController.createDonationEvent);
router.get('/getallevents', verifyToken, donationEventController.getAllDonationEvents);
router.put('/events/:id', verifyToken, donationEventController.updateDonationEvent);
router.delete('/events/:id', verifyToken, donationEventController.deleteDonationEvent);

module.exports = router;
