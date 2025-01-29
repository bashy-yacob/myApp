import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { API_BASE_URL } from '../../config/config';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/users?username=${username}&website=${password}`);
      if (response.ok) {
        const users = await response.json();
        console.log(users);
        if (users.length === 0) {
          setError('שם משתמש או סיסמה שגויים!');
          return;
        }
        const user = users[0];
        if (user) {
          const SaveUser = {
            name: user.username,
            email: user.email,
            id: user.id
          };
          localStorage.setItem('user', JSON.stringify(SaveUser));

          onLogin(user);

          navigate(`/users/${user.id}/home`);
        }
      } else {
        setError('שם משתמש או סיסמה שגויים!');
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (

    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>

  );
};

export default LoginPage;