import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDetailsPage.css'; // ייבוא העיצוב החדש

const UserDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { username, password } = location.state || {}; // נתונים שהועברו מהעמוד הקודם
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:5010/users?username=${username}`);
        if (response.ok) {
          const users = await response.json();
          if (users.length > 0) {
            const user = users[0];
            setUserId(user.id);
            setName(user.name || '');
            setEmail(user.email || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('שגיאה בטעינת פרטי המשתמש');
      }
    };

    if (username) {
      fetchUser();
    }
  }, [username]);

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    const updatedUser = {
      name,
      username,
      email,
      phone,
      address,
    };

    try {
      const response = await fetch(`http://localhost:5010/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        navigate('/home');
      } else {
        throw new Error('Failed to update user');
      }
    } catch (err) {
      console.error('Error updating user details:', err);
      setError('שגיאה בעדכון פרטי המשתמש');
    }
  };

  return (
    <div className="user-details-page">
      <div className="user-details-container">
        <h1>Complete Registration</h1>
        {error && <p className="user-details-error">{error}</p>}
        <form onSubmit={handleCompleteRegistration}>
          <input
            type="text"
            className="user-details-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="user-details-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="user-details-input"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            className="user-details-input"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit" className="user-details-button">Complete Registration</button>
        </form>
      </div>
    </div>
  );
};

export default UserDetailsPage;
