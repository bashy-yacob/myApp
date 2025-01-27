import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AlbomsPage.css';

const AlbomsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:5010/albums?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAlbums(data);
        }
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    fetchAlbums();
  }, [userId]);

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.id.toString().includes(searchQuery)
  );

  const addAlbum = async () => {
    if (!newAlbumTitle) return;

    const newAlbum = {
      userId: Number(userId),
      title: newAlbumTitle,
    };

    try {
      const response = await fetch('http://localhost:5010/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbum),
      });

      if (response.ok) {
        const savedAlbum = await response.json();
        setAlbums([...albums, savedAlbum]);
        setNewAlbumTitle('');
      }
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

  return (
    <div className="albums-page">
      <div className="albums-container">
        <h1>Albums</h1>
        <div className="search-sort">
          <input
            type="text"
            placeholder="Search by ID or title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <ul className="albums-list">
          {filteredAlbums.map(album => (
            <li key={album.id} onClick={() => navigate(`/users/${userId}/albums/${album.id}/potos`)}>
              <span><strong>ID:</strong> {album.id} - <strong>Title:</strong> {album.title}</span>
            </li>
          ))}
        </ul>
        <div className="add-album">
          <input
            type="text"
            placeholder="Add a new album"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
          />
          <button onClick={addAlbum}>Add Album</button>
        </div>
      </div>
    </div>
  );
};

export default AlbomsPage;
