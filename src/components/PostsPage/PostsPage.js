import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './PostsPage.css';

const PostsPage = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
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
  const [userEmail, setUserEmail] = useState('');
  const [showAddPost, setShowAddPost] = useState(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch(`http://localhost:5010/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, [userId]);

  useEffect(() => {
    if (viewAll) {
      viewAllPosts();
    } else {
      viewUserPosts();
    }
  }, [userId, viewAll]);

  const viewUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5010/posts?userId=${userId}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError('Error fetching posts: ' + error.message);
    }
  };

  const viewAllPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5010/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError('Error fetching posts: ' + error.message);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchCriterionChange = (e) => {
    setSearchCriterion(e.target.value);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (searchCriterion === 'id') {
        return post.id.toString().includes(search);
      } else if (searchCriterion === 'title') {
        return post.title.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
  }, [posts, search, searchCriterion]);

  const handleAddPost = async () => {
    if (!newPostTitle || !newPostContent) return;

    const newPost = {
      userId: Number(userId),
      title: newPostTitle,
      body: newPostContent,
    };

    try {
      const response = await fetch('http://localhost:5010/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts([...posts, savedPost]);
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
      const response = await fetch(`http://localhost:5010/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId));
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
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, title: editingTitle, body: editingContent } : post
    );

    const updatedPost = updatedPosts.find(post => post.id === id);

    try {
      const response = await fetch(`http://localhost:5010/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      });

      if (response.ok) {
        setPosts(updatedPosts);
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
    try {
      const response = await fetch(`http://localhost:5010/comments?postId=${postId}`);
      const data = await response.json();
      setComments(data);
      setShowComments(true);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;

    const comment = { postId: selectedPostId, body: newComment, userId: Number(userId), email: userEmail };

    try {
      const response = await fetch(`http://localhost:5010/comments`, {
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
      const response = await fetch(`http://localhost:5010/comments/${id}`, {
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
      const response = await fetch(`http://localhost:5010/comments/${commentId}`, {
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
        <button onClick={() => setViewAll(true)} className="view-all-btn">View All Posts</button>
        <button onClick={() => setViewAll(false)} className="view-my-btn">View My Posts</button>
      </div>
      {error && <div className="error">{error}</div>}
      <ul className="posts-list">
        {filteredPosts.map(post => (
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
                <button onClick={() => saveEdit(post.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <div>
                <span>{post.id} - {post.title}</span>
                <button onClick={() => handleSelectPost(post.id)}>Select</button>
                <button onClick={() => startEditing(post.id, post.title, post.body)}>Edit</button>
                <button onClick={() => handleDeletePost(post.id)}>Delete</button>
                {selectedPostId === post.id && (
                  <div className="selected-post">
                    <p>{post.body}</p>
                    <button onClick={() => handleShowComments(post.id)}>Show Comments</button>
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
                                  <button onClick={() => saveEditComment(comment.id)}>Save</button>
                                  <button onClick={cancelEditingComment}>Cancel</button>
                                </div>
                              ) : (
                                <div>
                                  <p>{comment.body}</p>
                                  {comment.email === userEmail && (
                                    <>
                                      <button onClick={() => startEditingComment(comment.id, comment.body)}>Edit</button>
                                      <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
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
