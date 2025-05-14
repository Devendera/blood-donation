import React from 'react';
import './ContactDonor.css';

const ContactDonor = () => {
  return (
    <div className="contact-container">
      <h2>Contact Donor</h2>

      <button className="btn call-btn">📞 Call Donor</button>
      <button className="btn message-btn">💬 Send Message</button>

      <div className="messages">
        <h3>Recent Messages</h3>

        <div className="message left">
          <div className="avatar">JD</div>
          <div className="text">I'm on my way to the hospital. Should arrive in about 18 minutes.</div>
        </div>

        <div className="message right">
          <div className="text reply">Thank you! We'll be waiting at the entrance.</div>
          <div className="avatar">You</div>
        </div>
      </div>
    </div>
  );
};

export default ContactDonor;
