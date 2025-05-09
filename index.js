// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("./firebase");
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Register User
app.post("/register", async (req, res) => {
  const { email, password, fullName, bloodType, agreedToTerms } = req.body;
  // Input validation
  if (!email || !password || !fullName || !bloodType) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "All fields are required."
    });
  }

  if (!agreedToTerms) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "You must agree to the terms and conditions."
    });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: fullName
    });
    // Store additional user data in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      fullName,
      bloodType,
      agreedToTerms,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({
      status: 201,
      success: true,
      message: "User registered successfully.",
      uid: userRecord.uid
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message
    });
  }
});

// Login - verify email/password using Firebase Auth REST API
const axios = require("axios");

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
   // Input validation
   if (!email || !password) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Email and password are required."
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
    return res.status(200).json({
      status: 200,
      success: true,
      message: "Login successful.",
      token: response.data.idToken
    });
  } catch (error) {
      console.error("Firebase login error:", error.response?.data || error.message);
      return res.status(401).json({
      status: 401,
      success: false,
      message: "Invalid email or password."
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
