// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./firebase");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register User
app.post("/register", async (req, res) => {
  const { email, password, fullName, bloodType, agreeToTerms } = req.body;

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

// Login - verify email/password using Firebase Auth REST API
const axios = require("axios");

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Email and password are required"
    });
  }

  try {
    const apiKey = process.env.FIREBASE_API_KEY;
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );
    
    res.json({
      status: 200,
      success: true,
      message: "Login successful",
      token: response.data.idToken
    });
  } catch (error) {
    res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid email or password",
      error: error.message
    });
  }
});

// General error handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: "Endpoint not found"
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});