// // import React, { useState, useEffect, useMemo } from 'react';
// // import './PostsPage.css';

// // const PostsPage = () => {
// //     const [posts, setPosts] = useState([]);
// //     const [comments, setComments] = useState([]);
// //     const [search, setSearch] = useState("");
// //     const [selectedPostId, setSelectedPostId] = useState(null);
// //     const [postComments, setPostComments] = useState([]);
// //     const [expandedPostId, setExpandedPostId] = useState(null);
// //     const [showComments, setShowComments] = useState(false);
// //     const [loadingComments, setLoadingComments] = useState(false);
// //     const [error, setError] = useState(null);
// //     const [searchCriterion, setSearchCriterion] = useState('id');

// //     const rawData = localStorage.getItem('user');
// //     const parsedData = rawData ? JSON.parse(rawData) : null;
// //     const userId = parsedData?.id;
// //     const userEmail = parsedData?.email;

// //     useEffect(() => {
// //         if (!parsedData) {
// //             return <div>Error: User data missing. Please log in again.</div>;
// //         }
// //         viewUserPosts();
// //     }, [parsedData?.id]);

// //     const viewAllPosts = async () => {
// //         try {
// //             const response = await fetch('http://localhost:5010/posts');
// //             const data = await response.json();
// //             setPosts(data);
// //         } catch (error) {
// //             setError('Error fetching all posts: ' + error.message);
// //         }
// //     };

// //     const viewUserPosts = async () => {
// //         try {
// //             const response = await fetch(`http://localhost:5010/posts?userId=${userId}`);
// //             const data = await response.json();
// //             setPosts(data);
// //         } catch (error) {
// //             setError('Error fetching posts: ' + error.message);
// //         }
// //     };
// import React, { useState, useEffect, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import './PostsPage.css';

// const PostsPage = () => {
//     const { userId } = useParams();
//     const [posts, setPosts] = useState([]);
//     const [comments, setComments] = useState([]);
//     const [search, setSearch] = useState("");
//     const [selectedPostId, setSelectedPostId] = useState(null);
//     const [postComments, setPostComments] = useState([]);
//     const [expandedPostId, setExpandedPostId] = useState(null);
//     const [showComments, setShowComments] = useState(false);
//     const [loadingComments, setLoadingComments] = useState(false);
//     const [error, setError] = useState(null);
//     const [searchCriterion, setSearchCriterion] = useState('id');

//     useEffect(() => {
//         viewUserPosts();
//     }, [userId]);

//     const viewUserPosts = async () => {
//         try {
//             const response = await fetch(`http://localhost:5010/posts?userId=${userId}`);
//             const data = await response.json();
//             setPosts(data);
//         } catch (error) {
//             setError('Error fetching posts: ' + error.message);
//         }
//     };



//     const fetchComments = async (postId) => {
//         setLoadingComments(true);
//         try {
//             const response = await fetch(`http://localhost:5010/comments?postId=${postId}`);
//             const data = await response.json();
//             setPostComments(data);
//         } catch (error) {
//             setError('Error fetching comments: ' + error.message);
//         } finally {
//             setLoadingComments(false);
//         }
//     };

//     const handleShowComments = async (postId) => {
//         if (postId === selectedPostId) {
//             if (!showComments) {
//                 await fetchComments(postId);
//             }
//             setShowComments(!showComments);
//         } else {
//             setPostComments([]);
//             setShowComments(false);
//             await fetchComments(postId);
//             setSelectedPostId(postId);
//             setShowComments(true);
//         }
//     };
//     //TODO לבדוק מה זה עושה
//     const toggleExpandPost = (postId) => {
//         setExpandedPostId(expandedPostId === postId ? null : postId);
//     };

//     const filterPosts = useMemo(() => {
//         return posts.filter(post => {
//             if (searchCriterion === 'id') {
//                 return post.id.toString().includes(search);
//             }
//             if (searchCriterion === 'title') {
//                 return post.title.toLowerCase().includes(search.toLowerCase());
//             }
//             return false;
//         });
//     }, [posts, search, searchCriterion]);

//     // const isCommentOwner = (commentUserId) => {
//     //     return parsedData && commentUserId == parsedData.id;
//     // };
//     const isCommentOwner = (commentEmail) => {
//         return parsedData && commentEmail === userEmail;
//     };

//     const addPost = async () => {
//         const title = prompt('Enter title:');
//         const body = prompt('Enter body:');
//         if (title && body) {
//             const newPost = {
//                 userId,
//                 title,
//                 body
//             };
//             try {
//                 const response = await fetch(`http://localhost:5010/posts`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(newPost)
//                 });
//                 const createdPost = await response.json();
//                 setPosts([...posts, createdPost]);
//             } catch (error) {
//                 setError('Error adding post: ' + error.message);
//             }
//         }
//     };

//     const deletePost = async (id) => {
//         const post = posts.find(post => post.id === id);
//         if (post && post.userId == userId) {
//             try {
//                 await fetch(`http://localhost:5010/posts/${id}`, { method: 'DELETE' });
//                 setPosts(posts.filter(post => post.id !== id));
//                 if (selectedPostId === id) {
//                     setSelectedPostId(null);
//                 }
//             } catch (error) {
//                 setError('Error deleting post: ' + error.message);
//             }
//         } else {
//             alert('You are not authorized to delete this post.');
//         }
//     };

//     const editPost = async (id) => {
//         const post = posts.find(post => post.id === id);
//         if (post && post.userId == userId) {
//             const newTitle = prompt('Edit title:', post.title);
//             const newBody = prompt('Edit body:', post.body);
//             if (newTitle !== null && newBody !== null) {
//                 try {
//                     await fetch(`http://localhost:5010/posts/${id}`, {
//                         method: 'PUT',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ ...post, title: newTitle, body: newBody })
//                     });
//                     setPosts(posts.map(p => p.id === id ? { ...p, title: newTitle, body: newBody } : p));
//                 } catch (error) {
//                     setError('Error editing post: ' + error.message);
//                 }
//             }
//         } else {
//             alert('You are not authorized to edit this post.');
//         }
//     };

//     const editComment = async (commentId) => {
//         const comment = postComments.find((comment) => comment.id === commentId);
//         // if (comment && isCommentOwner(comment.userId)) {
//         if (comment && isCommentOwner(comment.email)) {

//             const newBody = prompt('Edit your comment:', comment.body);
//             if (newBody) {
//                 try {
//                     await fetch(`http://localhost:5010/comments/${commentId}`, {
//                         method: 'PUT',
//                         headers: { 'Content-Type': 'application/json' },
//                         body: JSON.stringify({ ...comment, body: newBody }),
//                     });
//                     setPostComments(postComments.map((c) => (c.id === commentId ? { ...c, body: newBody } : c)));
//                 } catch (error) {
//                     setError('Error editing comment: ' + error.message);
//                 }
//             }
//         } else {
//             alert('You are not authorized to edit this comment.');
//         }
//     };

//     const deleteComment = async (commentId) => {
//         const comment = postComments.find((comment) => comment.id === commentId);
//         // if (comment && isCommentOwner(comment.userId)) {
//         if (comment && isCommentOwner(comment.email)) {
//             try {
//                 await fetch(`http://localhost:5010/comments/${commentId}`, { method: 'DELETE' });
//                 setPostComments(postComments.filter((c) => c.id !== commentId));
//             } catch (error) {
//                 setError('Error deleting comment: ' + error.message);
//             }
//         } else {
//             alert('You are not authorized to delete this comment.');
//         }
//     };

//     const addComment = async (postId) => {
//         const text = prompt('Enter comment:');
//         if (text) {
//             const newComment = {
//                 postId,
//                 userId,
//                 email: userEmail,
//                 body: text
//             };
//             try {
//                 const response = await fetch(`http://localhost:5010/comments`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify(newComment)
//                 });
//                 const createdComment = await response.json();
//                 setPostComments([...postComments, createdComment]);
//             } catch (error) {
//                 setError('Error adding comment: ' + error.message);
//             }
//         }
//     };

//     return (
//         <div className="posts-page">
//             <h1>Posts</h1>
//             {error && <div className="error-message">{error}</div>}

//             <div className="search-container">
//                 <select
//                     value={searchCriterion}
//                     onChange={(e) => setSearchCriterion(e.target.value)}
//                     className="search-select"
//                 >
//                     <option value="id">Search by ID</option>
//                     <option value="title">Search by Title</option>
//                 </select>
//                 <input
//                     type="text"
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder="Enter search term"
//                     className="search-input"
//                 />
//                 <button className="btn btn-primary" onClick={addPost}>Add Post</button>
//             </div>

//             <div className="filter-container">
//                 <button className="btn" onClick={() => viewUserPosts(parsedData.id)}>
//                     My Posts
//                 </button>
//                 <button className="btn" onClick={viewAllPosts}>
//                     All Posts
//                 </button>
//             </div>

//             <div id="postsContainer" className="posts-container">
//                 {filterPosts.length > 0 ? (
//                     filterPosts.map(post => (
//                         <div key={post.id} className={`post ${expandedPostId === post.id ? 'post-expanded' : ''}`}>
//                             <div>
//                                 <strong>ID:</strong> {post.id}<br />
//                                 <strong>Title:</strong> {post.title}<br />
//                                 <button className="btn" onClick={() => toggleExpandPost(post.id)}>
//                                     {expandedPostId === post.id ? 'Collapse' : 'Expand'}
//                                 </button>
//                                 {expandedPostId === post.id && (
//                                     <div className="post-details">
//                                         <strong>Body:</strong> {post.body}<br />
//                                         {/* //TODO גם פה עשיתי רק 2 == */}
//                                         {post.userId == userId && (
//                                             <>
//                                                 <button className="btn" onClick={() => editPost(post.id)}>Edit</button>
//                                                 <button className="btn btn-danger" onClick={() => deletePost(post.id)}>Delete</button>
//                                             </>
//                                         )}
//                                         <button className="btn" onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleShowComments(post.id);
//                                         }}>
//                                             {showComments && selectedPostId === post.id ? 'Hide Comments' : 'Show Comments'}
//                                         </button>
//                                         <button className="btn" onClick={(e) => {
//                                             e.stopPropagation();
//                                             addComment(post.id);
//                                         }}>Add Comment</button>

//                                         {showComments && selectedPostId === post.id && (
//                                             <div className="comments-section">
//                                                 <h3>Comments:</h3>
//                                                 {loadingComments ? (
//                                                     <p>Loading comments...</p>
//                                                 ) :
//                                                     postComments.length > 0 ? (
//                                                         <ul className="comments-list">
//                                                             {postComments.map((comment) => (
//                                                                 <li key={comment.id} className="comment-item">
//                                                                     {comment.body}
//                                                                     {/* {isCommentOwner(comment.userId) && ( */}
//                                                                     {isCommentOwner(comment.email) && (

//                                                                         <>
//                                                                             <button className="btn btn-small" onClick={() => editComment(comment.id)}>Edit</button>
//                                                                             <button className="btn btn-danger btn-small" onClick={() => deleteComment(comment.id)}>Delete</button>
//                                                                         </>
//                                                                     )}
//                                                                 </li>
//                                                             ))}
//                                                         </ul>
//                                                     )
//                                                         : (
//                                                             <p>No comments available.</p>
//                                                         )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No posts found.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default PostsPage;
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import './PostsPage.css';

const PostsPage = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [postComments, setPostComments] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);
  const [searchCriterion, setSearchCriterion] = useState('id');

  useEffect(() => {
    viewUserPosts();
  }, [userId]);

  const viewUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5010/posts?userId=${userId}`);
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
      } else if (searchCriterion === 'body') {
        return post.body.toLowerCase().includes(search.toLowerCase());
      }
      return false;
    });
  }, [posts, search, searchCriterion]);

  const handlePostClick = async (postId) => {
    setSelectedPostId(postId);
    setLoadingComments(true);
    try {
      const response = await fetch(`http://localhost:5010/comments?postId=${postId}`);
      const data = await response.json();
      setPostComments(data);
    } catch (error) {
      setError('Error fetching comments: ' + error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleExpandClick = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  return (
    <div className="posts-page">
      <h1>Posts</h1>
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
          <option value="body">Body</option>
        </select>
      </div>
      {error && <div className="error">{error}</div>}
      <ul className="posts-list">
        {filteredPosts.map(post => (
          <li key={post.id} className="post-item">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button onClick={() => handlePostClick(post.id)}>
              {selectedPostId === post.id ? 'Hide Comments' : 'View Comments'}
            </button>
            <button onClick={() => handleExpandClick(post.id)}>
              {expandedPostId === post.id ? 'Collapse' : 'Expand'}
            </button>
            {expandedPostId === post.id && (
              <div className="expanded-content">
                <p>Additional content for post {post.id}</p>
              </div>
            )}
            {selectedPostId === post.id && (
              <div className="comments-section">
                {loadingComments ? (
                  <p>Loading comments...</p>
                ) : (
                  <ul className="comments-list">
                    {postComments.map(comment => (
                      <li key={comment.id} className="comment-item">
                        <p>{comment.body}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsPage;