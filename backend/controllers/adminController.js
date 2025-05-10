const admin = require('../../firebase'); // or '../firebase' if firebase.js is in root
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const db = admin.firestore();

exports.registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, bloodType, donorStatus} = req.body;

    // Define allowed values
    const allowedBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "I don't know"];
    const allowedDonorStatuses = ["Blood Donor", "Healthcare Organization"];

    // Check for missing fields
    if (!firstName || !lastName || !email || !password || !bloodType || !donorStatus) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "All fields are required."
      });
    }

    // Validate bloodType and donorStatus
    if (!allowedBloodTypes.includes(bloodType)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid blood type."
      });
    }

    if (!allowedDonorStatuses.includes(donorStatus)) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid donor status."
      });
    }

    const snapshot = await db.collection('admins').where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(200).json({ status: 200,success: true, message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdminRef = db.collection('admins').doc();
    await newAdminRef.set({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      bloodType,
      donorStatus,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({ status: 201,success: true, message: 'Account created successfully' });
  } catch (err) {
    res.status(500).json({ status: 500, success: false, message: err.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Email and password are required.'
      });
    }

    const snapshot = await db.collection('admins').where('email', '==', email).get();
    if (snapshot.empty) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found'
      });
    }

    const userData = snapshot.docs[0].data();
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: 'Invalid password'
      });
    }

    const token = jwt.sign({ email: userData.email }, process.env.FIREBASE_API_KEY, {
      expiresIn: '1d'
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: 'Login successful',
      token,
      admin: userData
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      success: false,
      message: err.message
    });
  }
};
