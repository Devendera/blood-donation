// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./firebase");
const adminRoutes = require('./backend/routes/adminRoutes');
const dashboardRoutes = require('./backend/routes/dashboardRoutes');
const donationRoutes = require('./backend/routes/donationRoutes');
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Register User
app.post("/register", async (req, res) => {
  let { email, password, fullName, bloodType, agreeToTerms } = req.body;
  // Trim the email to remove leading/trailing spaces
  email = email.trim();
  // Input validation
  if (!email || !password || !fullName || !bloodType) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required."
    });
  }

  // Validate agreeToTerms - FIXED: Changed from agreedToTerms to agreeToTerms
  if (!agreeToTerms) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "You must agree to the terms and conditions."
    });
  }

  // Validate blood type
  const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  if (!validBloodTypes.includes(bloodType)) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid blood type"
    });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName
    });

    // Store extra data in Firestore
    const db = admin.firestore();
    await db.collection("users").doc(userRecord.uid).set({
      fullName,
      bloodType,
      email,
      createdAt: new Date(),
    });

    res.status(201).json({
      status: 201,
      success: true,
      message: "User registered successfully",
      uid: userRecord.uid 
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      success: false,
      message: error.message
    });
  }
});

app.get("/donors", async (req, res) => {
  try {
    const db = admin.firestore();
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No donors found",
        donors: [],
      });
    }

    const donors = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    res.status(200).json({
      status: 200,
      success: true,
         message: "Donors fetched successfully",
      total: donors.length,
      donors
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: "Failed to fetch donor data",
      error: error.message
    });
  }
});

// Login - verify email/password using Firebase Auth REST API
const axios = require("axios");

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const apiKey = process.env.FIREBASE_API_KEY;

    // Sign in using Firebase Auth REST API
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const idToken = response.data.idToken;

    // Verify and decode token to get uid
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch user data from Firestore
    const db = admin.firestore();
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User data not found in Firestore",
      });
    }

    const userData = userDoc.data();
    // Step 4: Convert Firestore timestamp to human-readable format
    let readableCreatedAt = null;
    const createdAt = userData.createdAt;

    if (createdAt && createdAt._seconds) {
      const date = new Date(createdAt._seconds * 1000);
      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      readableCreatedAt = date.toLocaleString("en-US", options);
    }

    // Send response with token + user details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful",
      token: idToken,
      user: {
        uid,
        fullName: userData.fullName,
        bloodType: userData.bloodType,
        email: userData.email,
        createdAt: readableCreatedAt
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid email or password",
      error: error.message,
    });
  }
});




app.use('/api/admin', adminRoutes);
app.use('/api', dashboardRoutes); // Request blood route
app.use('/user/donation', donationRoutes); // Protected by token


app.listen(5000, () => console.log('Server running on port 5000'));
