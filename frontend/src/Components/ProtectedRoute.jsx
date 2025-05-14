import React from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
   const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
    alert("Please log in to access this page.");
    navigate("/login"); 
    // return null;
  }


  return children;
};
 
export default ProtectedRoute;