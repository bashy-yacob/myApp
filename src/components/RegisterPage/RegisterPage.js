import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  // Registration states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');
  // User details states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Address states
  const [street, setStreet] = useState('');
  const [suite, setSuite] = useState('');
  const [city, setCity] = useState('');
  const [zipcode, setZipcode] = useState('');
  // Company states
  const [companyName, setCompanyName] = useState('');
  const [catchPhrase, setCatchPhrase] = useState('');
  const [bs, setBs] = useState('');
  // UI states
  const [error, setError] = useState('');
  const [isValidated, setIsValidated] = useState(false);

  const handleFirstStepValidation = async (e) => {
    e.preventDefault();

    if (password !== passwordVerify) {
      setError('סיסמאות אינן תואמות!');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5010/users?username=${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      const userExists = users.length > 0;
      if (userExists) {
        setError('שם המשתמש כבר קיים!');
        return;
      }
      setIsValidated(true);
      setError('');
    } catch (err) {
      console.error('Error details:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('לא ניתן להתחבר לשרת. אנא בדוק שהשרת פעיל');
      } else {
        setError(`שגיאה בבדיקת המשתמש: ${err.message}`);
      }
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      name,
      email,
      address: {
        street,
        suite,
        city,
        zipcode,
        geo: {
          lat: "0",
          lng: "0"
        }
      },
      phone,
      website: password,
      company: {
        name: companyName,
        catchPhrase,
        bs
      }
    };

    try {
      const response = await fetch('http://localhost:5010/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      if (response.ok) {
        const savedUser = await response.json();
        const itemToLocalStorage = {
          
          name : savedUser.username,
          email :savedUser.email,
          id :savedUser.id

        }
        localStorage.setItem('user', JSON.stringify(itemToLocalStorage));
        navigate(`/users/${savedUser.id}/home`); // Changed from '/home' to '/landing'
      }
    } catch (err) {
      setError('שגיאה ברישום המשתמש');
    }
  };

  return (
    <div className="register-page">
      {!isValidated ? (
        // First step - username and password validation
        <form onSubmit={handleFirstStepValidation}>
          <h2>Register</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="password"
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
            placeholder="Verify Password"
            required
          />
          <button type="submit">Next</button>
        </form>
      ) : (
        // Second step - user details
        <form onSubmit={handleCompleteRegistration}>
          <h2>Complete Your Details</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            required
          />
          <h3>Address</h3>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Street"
            required
          />
          <input
            type="text"
            value={suite}
            onChange={(e) => setSuite(e.target.value)}
            placeholder="Suite"
            required
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            required
          />
          <input
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="Zipcode"
            required
          />
          <h3>Company</h3>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            required
          />
          <input
            type="text"
            value={catchPhrase}
            onChange={(e) => setCatchPhrase(e.target.value)}
            placeholder="Company Catch Phrase"
            required
          />
          <input
            type="text"
            value={bs}
            onChange={(e) => setBs(e.target.value)}
            placeholder="Business Service"
            required
          />
          <button type="submit">Complete Registration</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterPage;