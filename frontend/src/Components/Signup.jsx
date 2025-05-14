import React, { useState } from 'react';
import './Signup.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";



function SignupForm() {
  // const [showPassword, setShowPassword] = useState(false);
 const navigate = useNavigate();
    const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: ""
  });

   const [bloodType, setBloodType] = useState("");
  const [agreeToTerms , setagreeToTerms ] = useState(false);
  const [error, setError] = useState("");

    const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

     console.log("Form values:");
    console.log("Name:", inputs.name);
    console.log("Email:", inputs.email);
    console.log("Password:", inputs.password);
    console.log("Blood Type:", bloodType);
    console.log("Terms Accepted:", agreeToTerms);


      if (
      !inputs.name ||
      !inputs.email ||
      !inputs.password ||
      !bloodType ||
      !agreeToTerms
    ) {
      setError("Please fill all required fields and accept the terms.");
      return;
    }
    setError("");

     try {
      const response = await axios.post("http://localhost:5000/register", {
     fullName: inputs.name,
        email: inputs.email,
        password: inputs.password,
          bloodType,
        // termsAccepted
        agreeToTerms 
        
      });
       console.log(response.data);
        alert("User registered successfully");
      navigate("/home");
       } catch (error) {
      console.error("Error in registering:", error);
      setError("Registration failed. Try again.");
    }
   
         };

         
  return (
    <div className="signup-container">
      <h2>Create an account</h2>
      <p>Enter your information to create an account</p>

      <form className="signup-form" onSubmit={handleSubmit}>
           {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>
          Full Name
          <input type="text" placeholder="John Doe" required
            value={inputs.name}
             onChange={handleChange}
            name="name"
             />
        </label>

        <label>
          Email
          <div className="input-icon">
            <span className="icon">@</span>
            <input type="email" placeholder="name@example.com"
               value={inputs.email}
            name="email"
             onChange={handleChange}
             required />
          </div>
        </label>

        <label>
          Password
          <div className="input-icon">
            <input
             onChange={handleChange}
              // type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              minLength={8}
                 value={inputs.password}
            name="password"
            />
            <span
              className="icon eye"
              // onClick={() => setShowPassword((prev) => !prev)}
            >
              👁️
            </span>
          </div>
          <small>Password must be at least 8 characters long</small>
        </label>

        <label>
          Blood Type
          <select 
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            required>
            <option value="">Select your blood type</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </label>

      <div className="checkbox-container">
      <label className="checkbox-label">
        <input type="checkbox" 
        checked={agreeToTerms}
              onChange={(e) => setagreeToTerms(e.target.checked)} />
        <span>I agree to the terms and conditions</span>
      </label>
    </div>

        <button type="submit" 
        className="signup-btn" 
      
        >
          👤 Sign Up
        </button>

        <p className="login-link">
          Already have an account?
             <Link to="/login" >
   Sign in
</Link>      </p>
      </form>
    </div>
  );
}

export default SignupForm;
