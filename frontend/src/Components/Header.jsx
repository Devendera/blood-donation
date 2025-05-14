import React ,{ useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Header.css";
import { useLocation } from 'react-router-dom';

export default function Header() {

  const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
const location = useLocation();
  // const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // useEffect(() => {
  //   const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  //   setIsLoggedIn(loggedIn);
  // }, []);

useEffect(() => {
  const loggedIn = localStorage.getItem("isLoggedIn") === "true";
  setIsLoggedIn(loggedIn);
}, [location]);

//  const handleLogout = () => {
//     localStorage.clear();
//     setIsLoggedIn(false);         
//      navigate("/login");          
//   };

const handleLogout = () => {
  localStorage.removeItem("isLoggedIn"); 
  setIsLoggedIn(false);         
  navigate("/login");          
};


  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo-circle" />
        <span className="logo-text">Priority Donor Club</span>
      </div>
      <nav className="navbar">
  
    
       <ul className="nav-list">
        <li className="nav-item">
           <Link to="/home" className="nav-link">Home</Link>
           </li>
        <li className="nav-item">
           <Link to="/donate" className="nav-link">Donate</Link>
           </li>
        <li className="nav-item">
           <Link to="/request" className="nav-link">Request</Link>
           </li>
            <li className="nav-item">
           <Link to="/track" className="nav-link">Track</Link>
           </li>
        <li className="nav-item">
           <Link to="/rewards" className="nav-link">Rewards</Link>
            <span className="dropdown-arrow">▼</span>
            </li>
      </ul>
    </nav>

       {!isLoggedIn ? (
        <Link to="/login" className="login-button">
          <span className="login-icon">⇨</span> Login
        </Link>
      ) : (
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      )}
    
{/* 
       <Link to="/login" className="login-button">
  <span className="login-icon">⇨</span> Login
</Link> */}


    </header>
  );
}
