import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import { API_BASE_URL } from '../../config/config';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
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
      setError('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users?username=${username}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users = await response.json();
      const userExists = users.length > 0;
      if (userExists) {
        setError('Username already exists!');
        return;
      }
      setIsValidated(true);
      setError('');
    } catch (err) {
      console.error('Error details:', err);
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Please check if server is running');
      } else {
        setError(`Error checking user: ${err.message}`);
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
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      
      if (response.ok) {
        const savedUser = await response.json();
        const userInfo = {
          name: savedUser.username,
          email: savedUser.email,
          id: savedUser.id
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        setUser(userInfo); // עדכון ה-context
        navigate(`/users/${savedUser.id}/home`);
      }
    } catch (err) {
      setError('Registration failed: ' + err.message);
    }
  };

  return (
    <div className="register-page">
      {!isValidated ? (
        <form onSubmit={handleFirstStepValidation}>
          <h2>Registration</h2>
          <section>
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
          </section>
          <button type="submit">Next</button>
        </form>
      ) : (
        <form onSubmit={handleCompleteRegistration}>
          <h2>Complete Details</h2>
          
          <section>
            <h3>Personal Information</h3>
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
          </section>

          <section>
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
          </section>

          <section>
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
              placeholder="Catch Phrase"
              required
            />
            <input
              type="text"
              value={bs}
              onChange={(e) => setBs(e.target.value)}
              placeholder="Business Service"
              required
            />
          </section>

          <button type="submit">Complete Registration</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default RegisterPage;