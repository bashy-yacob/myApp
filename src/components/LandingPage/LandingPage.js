import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to-MetaNest</h1>
      <p className="landing-description">
      Your new home for smart and organized personal information management.      </p>
      <div className="landing-buttons">
        <button className="landing-button register-button" onClick={() => navigate('/register')}>
        Register
        </button>
        <button className="landing-button login-button" onClick={() => navigate('/login')}>
        Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
