import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AlbumDetailPage.css';

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`http://localhost:5010/photos?albumId=${albumId}`);
        if (response.ok) {
          const data = await response.json();
          setPhotos(data);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    fetchPhotos();
  }, [albumId]);

  const addPhoto = async () => {
    if (!newPhotoUrl || !newPhotoTitle) return;

    const newPhoto = {
      albumId: Number(albumId),
      title: newPhotoTitle,
      url: newPhotoUrl,
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

  const deletePhoto = async (id) => {
    try {
      const response = await fetch(`http://localhost:5010/photos/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPhotos(photos.filter(photo => photo.id !== id));
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  return (
    <div className="album-detail-page">
      <h1>Album {albumId}</h1>
      <div className="add-photo">
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
        <button onClick={addPhoto}>Add Photo</button>
      </div>
      <div className="photos-container">
        {photos.map(photo => (
          <div key={photo.id} className="photo-item">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            <p>{photo.title}</p>
            <button onClick={() => deletePhoto(photo.id)}>Delete</button>
          </div>
        ))}
      </div>
      {loading && <div>Loading more photos...</div>}
    </div>
  );
};

export default AlbumDetailPage;
