// import React, { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const UserDetailsPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { username, password } = location.state || {}; // נתונים שהועברו מהעמוד הקודם
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [error, setError] = useState('');

//   const handleCompleteRegistration = async (e) => {
//     e.preventDefault();

//     const newUser = {
//       id: Date.now(),
//       name,
//       username,
//       email,
//       phone,
//       address,
//       website: '',
//       company: {
//         name: '',
//         catchPhrase: '',
//         bs: '',
//       },
//     };

//     try {
//       // הוספת המשתמש לשרת
//       await axios.post('http://localhost:5000/users', newUser);

//       // שמירת המשתמש ב-LocalStorage
//       localStorage.setItem('user', JSON.stringify(newUser));
//       navigate('/home'); // מעבר לעמוד הבית
//     } catch (err) {
//       console.error('Error completing registration:', err);
//       setError('שגיאה במערכת, נסה שוב מאוחר יותר.');
//     }
//   };

//   return (
//     <div>
//       <h1>Complete Registration</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       <form onSubmit={handleCompleteRegistration}>
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Phone"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Address"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           required
//         />
//         <button type="submit">Complete Registration</button>
//       </form>
//     </div>
//   );
// };

// export default UserDetailsPage;
import React, { useState } from 'react';
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

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    const newUser = {
      id: Date.now(),
      name,
      username,
      email,
      phone,
      address,
      website: '',
      company: {
        name: '',
        catchPhrase: '',
        bs: '',
      },
    };

    try {
      // הוספת המשתמש לשרת
      await axios.post('http://localhost:5010/users', newUser);

      // שמירת המשתמש ב-LocalStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/home'); // מעבר לעמוד הבית
    } catch (err) {
      console.error('Error completing registration:', err);
      setError('שגיאה במערכת, נסה שוב מאוחר יותר.');
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
