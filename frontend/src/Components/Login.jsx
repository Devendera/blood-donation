import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
   const navigate = useNavigate();
   const [inputs, setInputs] = useState({
      email: "",
      password: ""
    });
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
    console.log("Email:", inputs.email);
    console.log("Password:", inputs.password);
      if (
      !inputs.email ||
      !inputs.password 
     ) {
      setError("Please fill all required fields and accept the terms.");
      return;
    }
    setError("");
     try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/login`, {
        email: inputs.email,
        password: inputs.password,
        
      });
       console.log(response.data);
        alert("Logged in successfully");
        localStorage.setItem("isLoggedIn", "true");

      navigate("/home");
       } catch (error) {
      console.error("Error in registering:", error);
      setError("Registration failed. Try again.");
    }
   
         };


  // const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <p className="login-subtitle">Enter your email and password to sign in</p>
      
      <form className="login-form" onSubmit={handleSubmit}>
           {error && <p style={{ color: 'red' }}>{error}</p>}
        <label>Email</label>
        <div className="input-group">
          <span className="icon">@</span>
          <input type="email" placeholder="name@example.com" required
          value={inputs.email}
            name="email"
             onChange={handleChange} />
        </div>

        <div className="password-label-group">
          <label>Password</label>
          <a href="#">Forgot password?</a>
        </div>
        <div className="input-group">
          <input 
            // type={showPassword ? 'text' : 'password'} 
             onChange={handleChange}
              value={inputs.password}
            name="password"
            required 
          />
          <span 
            className="icon clickable" 
            // onClick={() => setShowPassword(!showPassword)}
          >
            👁
          </span>
        </div>

        <button className="sign-in-btn" type="submit">
          <span className="btn-icon">➡️</span> Sign In
        </button>

        <p className="signup-text">
          Don't have an account? 
           <Link to="/signup" >
   Sign up
</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
