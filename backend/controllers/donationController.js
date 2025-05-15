const admin = require('../../firebase');
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

exports.registerDonation = async (req, res) => {
  try {
    const {
      fullName,
      age,
      bloodType,
      weight,
      lastDonationDate,
      location,
      isHealthy,
      phoneNumber
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
      phoneNumber,
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

// GET all blood donations
exports.getAllDonations = async (req, res) => {
  try {
    const snapshot = await db.collection('bloodDonations').orderBy('createdAt', 'desc').get();

    const donations = snapshot.docs.map(doc => {
      const data = doc.data();

      // Convert Firestore Timestamp to JS Date
      const createdAtFormatted = data.createdAt?.seconds
        ? new Date(data.createdAt.seconds * 1000).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })
        : null;

      // Remove raw createdAt and return formatted version only
      const { createdAt, ...restData } = data;

      return {
        id: doc.id,
        ...restData,
        createdAtFormatted
      };
    });

    return res.status(200).json({
      status: 200,
      success: true,
      message: "All blood donations fetched successfully",
      data: donations
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};

// GET donor phone number by ID
exports.getDonorPhone = async (req, res) => {
  try {
    const { id } = req.params;

    const docRef = db.collection('bloodDonations').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Donor not found"
      });
    }

    const data = doc.data();

    return res.status(200).json({
      status: 200,
      success: true,
      phoneNumber: data.phoneNumber || null
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
};


