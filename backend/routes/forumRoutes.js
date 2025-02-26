const express = require('express');
const {
  getAllPosts,
  getPostsBySubject,
  getPostById,
  createPost,
  createReply,
  likePost,
  likeReply,
  getSubjects
} = require('../controllers/forumController');
const verifyToken = require('../middlewares/auth');
const optionalAuth = require('../middlewares/optionalAuth');

const router = express.Router();

router.get('/subjects', getSubjects);
router.get('/posts', getAllPosts);
router.get('/subjects/:subject/posts', getPostsBySubject);
router.get('/posts/:id', optionalAuth, getPostById);

router.post('/posts', verifyToken, createPost);
router.post('/posts/:postId/replies', verifyToken, createReply);
router.post('/posts/:postId/like', verifyToken, likePost);
router.post('/replies/:replyId/like', verifyToken, likeReply);

module.exports = router;