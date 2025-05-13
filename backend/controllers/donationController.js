const admin = require('../../firebase');
const db = admin.firestore();

exports.registerDonation = async (req, res) => {
  try {
    const {
      fullName,
      age,
      bloodType,
      weight,
      lastDonationDate,
      location,
      isHealthy
    } = req.body;

    // Validation
    if (!fullName || !age || !bloodType || !weight || !lastDonationDate || !location || isHealthy === undefined) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "All fields are required."
      });
    }

    if (age < 18 || age > 65) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "You must be between 18 and 65 years old."
      });
    }

    if (weight < 50) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "You must weigh at least 50kg."
      });
    }

    if (!isHealthy) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "You must be in good health to donate blood."
      });
    }

    // Save to Firebase
    await db.collection('bloodDonations').add({
      fullName,
      age,
      bloodType,
      weight,
      lastDonationDate,
      location,
      isHealthy,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(201).json({
      status: 201,
      success: true,
      message: "Donation registered successfully."
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};
