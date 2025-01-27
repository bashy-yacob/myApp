import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; // ייבוא העיצוב החדש

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== passwordVerify) {
      setError('סיסמאות אינן תואמות!');
      return;
    }

    try {
      // בודק אם שם המשתמש כבר קיים במערכת
      const response = await fetch(`http://localhost:5010/users?username=${username}`);
      if (response.ok) {      
      const users = await response.json();
      const userExists = users.length > 0;
      if (userExists) {
        setError('שם המשתמש כבר קיים!');
        return;
      }
      // אם שם המשתמש לא קיים, מבצע רישום
      const newUser = {
        username,
        password,
        website: password // או כל שדה אחר שמתאים לסיסמה
      };

      const registerResponse = await fetch('http://localhost:5010/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      if (!registerResponse.ok) {
        throw new Error('Network response was not ok');
      }
      
      // מנווט לדף ההתחברות לאחר הרישום המוצלח
      navigate('/login');
    }else{
      throw new Error('Network response was not ok');

    }
    } catch (err) {
      console.error('Error registering user:', err);
      setError('שגיאה ברישום, נסה שוב מאוחר יותר.');
    }
  };

  return (
    <div className="register-page">
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="password"
          value={passwordVerify}
          onChange={(e) => setPasswordVerify(e.target.value)}
          placeholder="Verify Password"
        />
        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default RegisterPage;