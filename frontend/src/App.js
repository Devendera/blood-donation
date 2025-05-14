import React from "react";
import Header from "./Components/Header";
import Hero from "./Components/Hero";

import Donate from './Components/Donate';
import Request from './Components/Request';

import Login from './Components/Login';
import Signup from './Components/Signup';
import "./App.css";
import {Routes, Route} from 'react-router-dom';
import HeroBanner from "./Components/Hero";

import DonationTracker from "./Components/Track";
import DonorRewards from "./Components/Rewards";
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <>
      <Header />
     {/* <div className="main-content"> */}
        <Routes>
            <Route path="/" element={<HeroBanner />} />
     
              <Route path="/home" element={<HeroBanner />} />

       <Route path="/donate" element={<ProtectedRoute>
        <Donate />
        </ProtectedRoute>} />

      <Route path="/request" element={<ProtectedRoute>
        <Request />
        </ProtectedRoute>} />

      <Route path="/track" element={<ProtectedRoute>
        <DonationTracker />
        </ProtectedRoute>} />

       <Route path="/rewards" element={<ProtectedRoute>
        <DonorRewards />
       </ProtectedRoute>} /> 
       
     <Route path="/login" element={<Login />} />
     <Route path="/signup" element={<Signup />} />
    
      </Routes>
       {/* </div> */}
      
    </>
  );
}

export default App;
