import React, { useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import './HomePage.css';
import postsImage from './posts.webp';
import todosImage from './todos.webp';
import albumsImage from './albums.webp';

const HomePage = () => {
  // const { userId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();  // הוספת useNavigate

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>ברוך הבא, {user?.name}!</h1>
        <p>מה תרצה לעשות היום?</p>
      </div>
      <div className="features-container">
        <div onClick={() => navigate(`/users/${user.id}/posts`)} className="feature-card">
          <img src={postsImage} alt="Posts" />
          <h2>Posts</h2>
          <p>View and manage your posts</p>
        </div>
        <div onClick={() => navigate(`/users/${user.id}/todos`)} className="feature-card">
          <img src={todosImage} alt="Todos" />
          <h2>Todos</h2>
          <p>Manage your tasks</p>
          </div>
          <div onClick={() => navigate(`/users/${user.id}/albums`)} className="feature-card">          <img src={albumsImage} alt="Albums" />
          <h2>Albums</h2>
          <p>Browse your photo albums</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;