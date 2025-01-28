import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './InfoPage.css';

const InfoPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5010/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <div className="info-page">
      <h1>User Information</h1>
      <div className="info-container">
        <div className="info-section">
          <h2>Personal Details</h2>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
        </div>

        <div className="info-section">
          <h2>Address</h2>
          <p><strong>Street:</strong> {userData.address?.street}</p>
          <p><strong>Suite:</strong> {userData.address?.suite}</p>
          <p><strong>City:</strong> {userData.address?.city}</p>
          <p><strong>Zipcode:</strong> {userData.address?.zipcode}</p>
          {userData.address?.geo && (
            <p>
              <strong>Location:</strong> {userData.address.geo.lat}, {userData.address.geo.lng}
            </p>
          )}
        </div>

        <div className="info-section">
          <h2>Company</h2>
          <p><strong>Name:</strong> {userData.company?.name}</p>
          <p><strong>Catch Phrase:</strong> {userData.company?.catchPhrase}</p>
          <p><strong>BS:</strong> {userData.company?.bs}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;