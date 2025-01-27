import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <nav className="dashboard-nav">
          <button onClick={() => navigate(`/users/${userId}/home`)}>Home</button>
          <button onClick={() => navigate(`/users/${userId}/home/info`)}>Info</button>
          <button onClick={() => navigate(`/users/${userId}/todos`)}>Todos</button>
          <button onClick={() => navigate(`/users/${userId}/posts`)}>Posts</button>
          <button onClick={() => navigate(`/users/${userId}/albums`)}>Albums</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;