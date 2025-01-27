import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

const Albums = () => {
  const { userId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [photoPage, setPhotoPage] = useState(1);
  let start = 0;
  let limit = 10;
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(`http://localhost:5010/albums?userId=${userId}`);
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, [userId]);

   
    // קריאה לשרת להבאת תמונות של אלבום מסוים
    const fetchPhotos = async (albumId, page = 1) => {

        try {
            const response = await fetch(
                `http://localhost:5010/photos?albumId=${albumId}&_start=${start}&_limit=${limit}` // טעינת תמונות בשלבים עם limit
            );
            const data = await response.json();
            setPhotos((prevPhotos) => [...prevPhotos, ...data]); // הוספת תמונות חדשות
            setPhotoPage(page); // עדכון הדף הנוכחי
            start+=10;
        } catch (error) {
            console.error("Error fetching photos:", error);
        } finally {
            setLoading(false);
        }
    };

    // טיפול בלחיצה על אלבום
    const handleAlbumClick = (albumId) => {
        setSelectedAlbum(albumId);
        setPhotos([]); // איפוס רשימת התמונות
        fetchPhotos(albumId); // טעינת הדף הראשון של התמונות
    };

    // טעינת דף נוסף של תמונות
    const loadMorePhotos = () => {
        if (selectedAlbum) {
            fetchPhotos(selectedAlbum, photoPage + 1);
        }
    };

    return (
        <div>
            <h1>Albums</h1>
            {!selectedAlbum ? (
                <div>
                    <h2>Album List</h2>
                    <ul>
                        {albums.map((album) => (
                            <li key={album.id}>
                                <button onClick={() => handleAlbumClick(album.id)}>
                                    {album.id} - {album.title}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div>
                    <h2>Album {selectedAlbum} Photos</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {photos.map((photo) => (
                            <div key={photo.id}>
                                <img src={photo.thumbnailUrl} alt={photo.title} />
                                <p>{photo.title}</p>
                            </div>
                        ))}
                    </div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <button onClick={loadMorePhotos}>Load More</button>
                    )}
                    <button onClick={() => setSelectedAlbum(null)}>Back to Albums</button>
                </div>
            )}
        </div>
    );
};

export default Albums;
