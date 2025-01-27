import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import HomePage from './components/HomePage/HomePage';
import TodosPage from './components/TodosPage/TodosPage';
import PostsPage from './components/PostsPage/PostsPage';
import AlbomsPage from './components/AlbomsPage/AlbomsPage';
import AlbumDetailPage from './components/AlbumDetailPage/AlbumDetailPage';
import LandingPage from './components/LandingPage/LandingPage';
import InfoPage from './components/InfoPage/InfoPage';
import Dashboard from './components/Dashboard/Dashboard';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import './App.css';

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  // const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
   
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {!user ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage onLogin={setUser} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Navigate to={`/users/${user.id}/home`} />} />
              <Route path="/users/:userId/*" element={<Dashboard user={user} onLogout={handleLogout} />}>
                <Route path="home" element={<HomePage user={user} />} />
                <Route path="home/info" element={<InfoPage user={user} />} />
                <Route path="todos" element={<TodosPage />} />
                <Route path="posts" element={<PostsPage />} />
                <Route path="albums" element={<AlbomsPage />} />
                <Route path="albums/:albumId/photos" element={<AlbumDetailPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;