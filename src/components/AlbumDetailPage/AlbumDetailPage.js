import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AlbumDetailPage.css';
import { API_BASE_URL } from '../../config/config';

const AlbumDetailPage = () => {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const photosPerPage = 10;

  const fetchPhotos = async (start) => {
    try {
      setLoading(true);
      const response = await fetch(
        // `${API_BASE_URL}/photos?albumId=${albumId}&_start=${start}&_limit=${photosPerPage}&_end=${start + photosPerPage}`
        `${API_BASE_URL}/photos?albumId=${albumId}&_start=${start}&_limit=${photosPerPage}`
      );

      if (response.ok) {
        const newPhotos = await response.json();
        console.log('Fetched photos count:', newPhotos.length); 
        if (newPhotos.length < photosPerPage) {
          setHasMore(false);
        }
        setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
      }
    } catch (err) {
      setError('Error loading photos');
      console.error(err);
    } 
    
    finally {
      setLoading(false);
    }
  };

  // טעינה ראשונית
  useEffect(() => {
    setPhotos([]);

    
    fetchPhotos(0);
  }, [albumId]);

    
  const handleLoadMore = () => {
    fetchPhotos(photos.length);
  };

  const handleDelete = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          setPhotos(photos.filter(photo => photo.id !== photoId));
        }
      } catch (err) {
        setError('Error deleting photo');
      }
    }
  };

  const handleEdit = (photo) => {
    setEditingPhoto(photo);
    setEditTitle(photo.title);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/${editingPhoto.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: editTitle })
      });
      if (response.ok) {
        const updatedPhoto = await response.json();
        setPhotos(photos.map(photo =>
          photo.id === updatedPhoto.id ? updatedPhoto : photo
        ));
        setEditingPhoto(null);
        setEditTitle('');
      }
    } catch (err) {
      setError('Error updating photo');
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('`${API_BASE_URL}/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          albumId: parseInt(albumId),
          title: newPhotoTitle,
          url: newPhotoUrl,
          thumbnailUrl: newPhotoUrl
        })
      });

      if (response.ok) {
        const newPhoto = await response.json();
        setPhotos(prevPhotos => [newPhoto, ...prevPhotos]);
        setNewPhotoUrl('');
        setNewPhotoTitle('');
        setIsAddingPhoto(false);
      }
    } catch (err) {
      setError('Error adding photo');
    }
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="album-detail">
      <h2>Album Photos</h2>
      <div className="photos-grid">
        {photos.map(photo => (
          <div key={photo.id} className="photo-card">
            <img src={photo.thumbnailUrl} alt={photo.title} />
            {editingPhoto?.id === photo.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <div className="edit-buttons">
                  <button onClick={handleUpdate}>Save</button>
                  <button onClick={() => setEditingPhoto(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="photo-controls">
                <p>{photo.title}</p>
                <div className="action-buttons">
                  <button onClick={() => handleEdit(photo)} className="edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(photo.id)} className="delete-button">
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        className="add-photo-toggle-btn"
        onClick={() => setIsAddingPhoto(!isAddingPhoto)}
      >
        {isAddingPhoto ? '×' : '+'}
      </button>

      {isAddingPhoto && (
        <form className="add-photo-form" onSubmit={handleAddPhoto}>
          <input
            type="text"
            value={newPhotoTitle}
            onChange={(e) => setNewPhotoTitle(e.target.value)}
            placeholder="Photo title"
            required
          />
          <input
            type="url"
            value={newPhotoUrl}
            onChange={(e) => setNewPhotoUrl(e.target.value)}
            placeholder="Photo URL"
            required
          />
          <button type="submit" className="add-photo-submit-btn">
            Add Photo
          </button>
        </form>
      )}

      {hasMore && (
        <button
          className="load-more-button"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};

export default AlbumDetailPage;
