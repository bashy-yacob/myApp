import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './HomePage.css';

const HomePage = ({ user }) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  useEffect(() => {
    if (user && window.location.pathname !== `/users/${user.id}/home`) {
      navigate(`/users/${user.id}/home`);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="home-page">
      <h1>Welcome, {user?.name}!</h1>
      <main className="home-content">
        <p>Select an option from the menu to get started!</p>
      </main>
    </div>
  );
};

export default HomePage;