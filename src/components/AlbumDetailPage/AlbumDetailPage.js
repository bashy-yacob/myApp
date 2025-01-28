import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AlbumDetailPage.css';

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [showAddPhoto, setShowAddPhoto] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, [albumId, page]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5010/photos?albumId=${albumId}&_page=${page}&_limit=10`);
      const data = await response.json();
      setPhotos(prevPhotos => [...prevPhotos, ...data]);
      setLoading(false);
    } catch (error) {
      setError('Error fetching photos: ' + error.message);
      setLoading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (!newPhotoUrl || !newPhotoTitle) return;

    const newPhoto = {
      albumId: Number(albumId),
      url: newPhotoUrl,
      title: newPhotoTitle,
      thumbnailUrl: newPhotoUrl,
    };

    try {
      const response = await fetch('http://localhost:5010/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPhoto),
      });

      if (response.ok) {
        const savedPhoto = await response.json();
        setPhotos([...photos, savedPhoto]);
        setNewPhotoUrl('');
        setNewPhotoTitle('');
      }
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      const response = await fetch(`http://localhost:5010/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos(photos.filter(photo => photo.id !== photoId));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <div className="album-detail-page">
      <h1>Album Details</h1>
      {error && <div className="error">{error}</div>}
      <div className="photos-container">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
            <button onClick={() => handleDeletePhoto(photo.id)}>Delete</button>
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      <button onClick={() => setPage(prevPage => prevPage + 1)}>Load More</button>
      
      {showAddPhoto && (
        <div className="add-photo-form">
          <input
            type="text"
            placeholder="Photo URL"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
          />
          <input
            type="text"
            placeholder="Photo Title"
            value={newPhotoTitle}
            onChange={(e) => setNewPhotoTitle(e.target.value)}
          />
          <button onClick={handleAddPhoto} className="add-photo-submit-btn">Add Photo</button>
        </div>
      )}
      <button className="add-photo-toggle-btn" onClick={() => setShowAddPhoto(!showAddPhoto)}>+</button>
    </div>
  );
};

export default AlbumDetailPage;
