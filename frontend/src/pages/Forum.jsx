// frontend/src/pages/Forum.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  getPostsBySubject, 
  getPostById,
  createPost, 
  createReply, 
  likePost, 
  likeReply 
} from "../services/forumApi";

function Forum() {
  const { subject } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(subject || "Mathematics");
  const [subjects, setSubjects] = useState(['Mathematics', 'Physics', 'Computer Science', 'English']);

  // Fetch posts based on subject
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        if (subject) {
          // Make sure subject matches one of our valid subjects
          const validSubject = subjects.find(
            s => s.toLowerCase() === subject.toLowerCase()
          );
          
          if (validSubject) {
            setSelectedSubject(validSubject);
            const data = await getPostsBySubject(validSubject);
            setPosts(data);
          } else {
            navigate("/forum");
            return;
          }
        } else if (selectedSubject) {
          // If no subject in URL but we have a selectedSubject, use that
          const data = await getPostsBySubject(selectedSubject);
          setPosts(data);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [subject, selectedSubject, navigate, subjects]);
  
  // Fetch available subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch('/api/forum/subjects');
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
        
        const data = await response.json();
        setSubjects(data.subjects);
      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };
    
    fetchSubjects();
  }, []);

  const handleSubjectChange = (event) => {
    const newSubject = event.target.value;
    setSelectedSubject(newSubject);
    navigate(`/forum/${newSubject}`);
  };

  const handleNewPost = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const data = await createPost({
        title: newPostTitle,
        content: newPostContent,
        subject: selectedSubject
      }, token);
      
      setPosts(prevPosts => [data.post, ...prevPosts]);
      setNewPostTitle("");
      setNewPostContent("");
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    }
  };

  const handleReply = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!replyContent.trim()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const data = await createReply(postId, replyContent, token);
      
      // Update the post with the new reply
      setPosts(posts.map(post => {
        if (post.id === parseInt(postId)) {
          return {
            ...post,
            ForumReplies: [...(post.ForumReplies || []), data.reply]
          };
        }
        return post;
      }));
      
      setReplyContent("");
      setReplyingTo(null);
    } catch (err) {
      console.error('Error creating reply:', err);
      setError('Failed to create reply. Please try again.');
    }
  };

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const data = await likePost(postId, token);
      
      setPosts(posts.map(post => {
        if (post.id === parseInt(postId)) {
          return {
            ...post,
            likes: data.likes,
            userLiked: data.liked
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleReplyLike = async (replyId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const data = await likeReply(replyId, token);
      
      setPosts(posts.map(post => {
        if (post.ForumReplies) {
          const updatedReplies = post.ForumReplies.map(reply => {
            if (reply.id === parseInt(replyId)) {
              return {
                ...reply,
                likes: data.likes,
                userLiked: data.liked
              };
            }
            return reply;
          });
          
          return {
            ...post,
            ForumReplies: updatedReplies
          };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error liking reply:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            {selectedSubject} Forum
          </h1>
          
          <div className="flex items-center space-x-2">
            <label htmlFor="subject-select" className="text-gray-700 font-medium">
              Subject:
            </label>
            <select
              id="subject-select"
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {/* New Post Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-200 hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a New Post</h2>
          {!isAuthenticated ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">You need to be logged in to create posts.</p>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Log In
              </button>
            </div>
          ) : (
            <form onSubmit={handleNewPost}>
              <div className="mb-4">
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Post title..."
                  required
                />
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none"
                placeholder="Share your thoughts..."
                rows="3"
                required
              />
              <div className="flex justify-end mt-3">
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                >
                  Post
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">No posts in this forum yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-200 hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {post.User?.username?.[0] || 'U'}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{post.User?.username || 'Unknown User'}</h3>
                      <p className="text-gray-500 text-sm">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      post.userLiked 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <span className="text-lg">👍</span>
                    <span className="font-medium text-gray-600">{post.likes}</span>
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{post.content}</p>

                <button
                  onClick={() => isAuthenticated ? setReplyingTo(post.id) : navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  <span>Reply</span>
                </button>

                {replyingTo === post.id && (
                  <div className="mb-4 bg-gray-50 rounded-xl p-4">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Write your reply..."
                      rows="2"
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleReply(post.id)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                      >
                        Submit
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyContent("");
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Replies */}
                {post.ForumReplies && post.ForumReplies.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Replies ({post.ForumReplies.length})</h4>
                    {post.ForumReplies.map(reply => (
                      <div key={reply.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white font-semibold text-sm">
                              {reply.User?.username?.[0] || 'U'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{reply.User?.username || 'Unknown User'}</h4>
                              <p className="text-gray-500 text-sm">
                                {new Date(reply.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleReplyLike(reply.id)}
                            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all duration-200 ${
                              reply.userLiked 
                                ? "border-blue-500 bg-blue-50" 
                                : "border-gray-200 hover:border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            <span>👍</span>
                            <span className="font-medium text-gray-600">{reply.likes}</span>
                          </button>
                        </div>
                        <p className="text-gray-700 ml-11">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default Forum;