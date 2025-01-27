import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const InfoPage = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5010/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="info-page">
      <h2>Information for {userData.name}</h2>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Address:</strong> {userData.address.suite}, {userData.address.street}, {userData.address.city} {userData.address.zipcode}</p>
      <p><strong>Geo:</strong> Lat: {userData.address.geo.lat}, Lng: {userData.address.geo.lng}</p>
    </div>
  );
};

export default InfoPage;