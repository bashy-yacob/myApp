import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import './PostsPage.css';
import { API_BASE_URL } from '../../config/config';
import { UserContext } from '../../context/UserContext';

const PostsPage = () => {
  const { userId } = useParams();
  const { setUser } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newComment, setNewComment] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [error, setError] = useState(null);
  const [searchCriterion, setSearchCriterion] = useState('id');
  const [showComments, setShowComments] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [showAddPost, setShowAddPost] = useState(false);
  const [sortCriterion, setSortCriterion] = useState('id');
  const [allPosts, setAllPosts] = useState([]);
  const userEmail = setUser.email;

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/posts`);
        if (response.ok) {          
          const data = await response.json();
          console.log('Received data:', data);
          setAllPosts(data);
        }
      } catch (error) {
        console.error('Detailed error:', error);
        if (error.message.includes('Failed to fetch')) {
          setError('השרת לא זמין. אנא בדוק שהשרת פועל.');
        } else {
          setError(`שגיאה בטעינת הנתונים: ${error.message}`);
        }
      }
    };
    fetchAllPosts();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
  };

  const handleSortCriterionChange = (e) => {
    setSortCriterion(e.target.value);
  };

  const displayedPosts = useMemo(() => {
    return viewAll ? allPosts : allPosts.filter(post => post.userId === Number(userId));
  }, [allPosts, viewAll, userId]);

  const filteredPosts = useMemo(() => {
    return displayedPosts.filter(post => {
      if (searchCriterion === 'id') {
        return post.id.toString().includes(search);
      } else if (searchCriterion === 'title') {
        return post.title.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
  }, [displayedPosts, search, searchCriterion]);

  const sortedPosts = useMemo(() => {
    const sorted = [...filteredPosts];
    if (sortCriterion === 'id') {
      sorted.sort((a, b) => a.id - b.id);
    } else if (sortCriterion === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [filteredPosts, sortCriterion]);

  const handleAddPost = async () => {
    if (!newPostTitle || !newPostContent) return;

    const newPost = {
      userId: Number(userId),
      title: newPostTitle,
      body: newPostContent,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const savedPost = await response.json();
        setAllPosts([...allPosts, savedPost]);
        setNewPostTitle('');
        setNewPostContent('');
        setShowAddPost(false);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAllPosts(allPosts.filter(post => post.id !== postId));
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const startEditing = (id, title, content) => {
    setEditingPostId(id);
    setEditingTitle(title);
    setEditingContent(content);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditingTitle('');
    setEditingContent('');
  };

  const saveEdit = async (id) => {
    const updatedPosts = allPosts.map(post =>
      post.id === id ? { ...post, title: editingTitle, body: editingContent } : post
    );

    const updatedPost = updatedPosts.find(post => post.id === id);

    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        setAllPosts(updatedPosts);
        cancelEditing();
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleSelectPost = (postId) => {
    setSelectedPostId(selectedPostId === postId ? null : postId);
    setShowComments(false);
  };

  const handleShowComments = async (postId) => {
    if (selectedPostId === postId && showComments) {
      setShowComments(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
        setShowComments(true);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;

    const comment = { postId: selectedPostId, body: newComment, userId: Number(userId), email: userEmail };

    try {
      const response = await fetch(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([...comments, savedComment]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const startEditingComment = (id, content) => {
    setEditingCommentId(id);
    setEditingCommentContent(content);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const saveEditComment = async (id) => {
    const updatedComments = comments.map(comment =>
      comment.id === id ? { ...comment, body: editingCommentContent } : comment
    );

    const updatedComment = updatedComments.find(comment => comment.id === id);

    try {
      const response = await fetch(`${API_BASE_URL}/comments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedComment),
      });

      if (response.ok) {
        setComments(updatedComments);
        cancelEditingComment();
      }
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(comments.filter(comment => comment.id !== commentId));
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="posts-page">
      <h1 className="posts-title">Posts</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
        <select value={searchCriterion} onChange={handleSearchCriterionChange}>
          <option value="id">ID</option>
          <option value="title">Title</option>
        </select>
        <select value={sortCriterion} onChange={handleSortCriterionChange}>
          <option value="id">Sort by ID</option>
          <option value="title">Sort by Title</option>
        </select>
        <button onClick={() => setViewAll(true)} className="view-all-btn">All Posts</button>
        <button onClick={() => setViewAll(false)} className="view-my-btn">My Posts</button>
      </div>
      {error && <div className="error">{error}</div>}
      <ul className="posts-list">
        {sortedPosts.map(post => (
          <li key={post.id} className={`post-item ${selectedPostId === post.id ? 'selected' : ''}`}>
            {editingPostId === post.id ? (
              <div>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <button onClick={() => saveEdit(post.id)} className="save-btn">Save</button>
                <button onClick={cancelEditing} className="cancel-btn">Cancel</button>
              </div>
            ) : (
              <div>
                <div>
                  <span className="post-id">{post.id}</span>
                  <span className="post-title">{post.title}</span>
                </div>
                <div className="button-container">
                  <button onClick={() => handleSelectPost(post.id)} className="read-more-btn">read more</button>
                  {post.userId === Number(userId) && (
                    <>
                      <button onClick={() => startEditing(post.id, post.title, post.body)} className="edit-btn">Edit</button>
                      <button onClick={() => handleDeletePost(post.id)} className="delete-btn">Delete</button>
                    </>
                  )}
                </div>
                {selectedPostId === post.id && (
                  <div className="selected-post">
                    <p>{post.body}</p>
                    <button onClick={() => handleShowComments(post.id)} className="show-comments-btn">Show Comments</button>
                    {showComments && (
                      <>
                        <h3>Comments</h3>
                        <ul className="comments-list">
                          {comments.map(comment => (
                            <li key={comment.id} className="comment-item">
                              {editingCommentId === comment.id ? (
                                <div>
                                  <textarea
                                    value={editingCommentContent}
                                    onChange={(e) => setEditingCommentContent(e.target.value)}
                                  />
                                  <button onClick={() => saveEditComment(comment.id)} className="save-btn">Save</button>
                                  <button onClick={cancelEditingComment} className="cancel-btn">Cancel</button>
                                </div>
                              ) : (
                                <div>
                                  <p>{comment.body}</p>
                                  {comment.email === userEmail && (
                                    <>
                                      <button onClick={() => startEditingComment(comment.id, comment.body)} className="edit-btn">Edit</button>
                                      <button onClick={() => handleDeleteComment(comment.id)} className="delete-btn">Delete</button>
                                    </>
                                  )}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                        <input
                          type="text"
                          placeholder="Add a comment"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="comment-textarea"
                        />
                        <button onClick={handleAddComment} className="add-comment-btn">Add Comment</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
      {showAddPost && (
        <div className="add-post-form">
          <input
            type="text"
            placeholder="Post Title"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            className="add-post-input"
          />
          <textarea
            placeholder="Post Content"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            className="add-post-textarea"
          />
          <button onClick={handleAddPost} className="add-post-submit-btn">Add Post</button>
        </div>
      )}
      <button className="add-post-toggle-btn" onClick={() => setShowAddPost(!showAddPost)}>+</button>
    </div>
  );
};

export default PostsPage;
