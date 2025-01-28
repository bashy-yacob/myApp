import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AlbomsPage.css';
import { API_BASE_URL } from '../../config/config';

const AlbomsPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState('');
  const [searchCriterion, setSearchCriterion] = useState('id');
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [error, setError] = useState(null);
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [sortBy, setSortBy] = useState('id'); // Default sort
  const [sortDirection, setSortDirection] = useState('asc'); // Default direction

  useEffect(() => {
    fetchAlbums();
  }, [userId]);

  const fetchAlbums = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/albums?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      }
    } catch (error) {
      setError('Error fetching albums: ' + error.message);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
  };

  const filteredAlbums = useMemo(() => {
    return albums.filter(album => {
      if (searchCriterion === 'id') {
        return album.id.toString().includes(search);
      } else if (searchCriterion === 'title') {
        return album.title.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
  }, [albums, search, searchCriterion]);

  const handleAddAlbum = async () => {
    if (!newAlbumTitle) return;

    const newAlbum = {
      userId: Number(userId),
      title: newAlbumTitle,
    };

    try {
      const response = await fetch('${API_BASE_URL}/albums', {
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

  const handleNavigateToAlbum = (albumId) => {
    navigate(`${albumId}/photos`);
  };

  const handleSort = (e) => {
    const value = e.target.value;
    const [newSortBy, newDirection] = value.split('-');
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  const getSortedAlbums = () => {
    return [...albums].sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];
      
      if (typeof valueA === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });
  };

  return (
    <div className="albums-page">
      <h1>Albums</h1>
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleSearch}
          />
          <select value={searchCriterion} onChange={handleSearchCriterionChange}>
            <option value="id">ID</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="sort-controls">
          <span>Sort by:</span>
          <select 
            value={`${sortBy}-${sortDirection}`}
            onChange={handleSort}
            className="sort-select"
          >
            <option value="id-asc">ID (Ascending)</option>
            <option value="id-desc">ID (Descending)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
      <ul className="albums-list">
        {getSortedAlbums().map(album => (
          <li key={album.id}>
            <span>{album.id} - {album.title}</span>
            <button onClick={() => handleNavigateToAlbum(album.id)} className="open-album-btn">Open Album</button>
          </li>
        ))}
      </ul>
      {showAddAlbum && (
        <div className="add-album-form">
          <input
            type="text"
            placeholder="Album Title"
            value={newAlbumTitle}
            onChange={(e) => setNewAlbumTitle(e.target.value)}
          />
          <button onClick={handleAddAlbum}>Add Album</button>
        </div>
      )}
      <button className="add-album-toggle-btn" onClick={() => setShowAddAlbum(!showAddAlbum)}>+</button>
    </div>
  );
};

export default AlbomsPage;
