import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <div className="animation-container">
        <div className="animation">
          <div className="spaceship">
            <div className="body"></div>
            <div className="window"></div>
            <div className="flame"></div>
          </div>
        </div>
      </div>
      <Link to="/" className="home-link">Go Back Home</Link>
    </div>
  );
};

export default NotFoundPage;
