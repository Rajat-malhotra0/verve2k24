import React, { useState } from "react";

// Mock data structure
const initialPosts = [
  {
    id: 1,
    author: "John Doe",
    content: "Has anyone solved the calculus problem from chapter 4?",
    timestamp: "2024-02-25T10:00:00",
    likes: 5,
    replies: [
      {
        id: 1,
        author: "Jane Smith",
        content: "Yes, I can help you with that. The key is to use integration by parts.",
        timestamp: "2024-02-25T10:30:00",
        likes: 3
      }
    ]
  },
  {
    id: 2,
    author: "Alice Johnson",
    content: "Looking for study partners for the upcoming physics exam!",
    timestamp: "2024-02-25T09:00:00",
    likes: 2,
    replies: []
  }
];

function Forum() {
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const handleNewPost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post = {
      id: posts.length + 1,
      author: "Current User",
      content: newPost,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    setPosts([post, ...posts]);
    setNewPost("");
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const handleReply = (postId) => {
    if (!replyContent.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const reply = {
          id: post.replies.length + 1,
          author: "Current User",
          content: replyContent,
          timestamp: new Date().toISOString(),
          likes: 0
        };
        return { 
          ...post, 
          replies: [...post.replies, reply] 
        };
      }
      return post;
    }));
    
    setReplyContent("");
    setReplyingTo(null);
  };

  const handleReplyLike = (postId, replyId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedReplies = post.replies.map(reply =>
          reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply
        );
        return { ...post, replies: updatedReplies };
      }
      return post;
    }));
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Discussion Forum
        </h1>
        
        {/* New Post Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-200 hover:shadow-xl">
          <form onSubmit={handleNewPost}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Share your thoughts..."
              rows="3"
            />
            <div className="flex justify-end mt-3">
              <button 
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-200 hover:shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{post.author}</h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(post.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <span className="text-lg">👍</span>
                  <span className="font-medium text-gray-600">{post.likes}</span>
                </button>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4 pl-13">{post.content}</p>

              <button
                onClick={() => setReplyingTo(post.id)}
                className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center space-x-2 pl-13"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                <span>Reply</span>
              </button>

              {replyingTo === post.id && (
                <div className="ml-13 mb-4 bg-gray-50 rounded-xl p-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
              <div className="ml-13 space-y-4">
                {post.replies.map(reply => (
                  <div key={reply.id} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white font-semibold text-sm">
                          {reply.author.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{reply.author}</h4>
                          <p className="text-gray-500 text-sm">
                            {new Date(reply.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleReplyLike(post.id, reply.id)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                      >
                        <span>👍</span>
                        <span className="font-medium text-gray-600">{reply.likes}</span>
                      </button>
                    </div>
                    <p className="text-gray-700 ml-11">{reply.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Forum;