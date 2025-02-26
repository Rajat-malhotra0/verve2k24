const { ForumPost, ForumReply, User, Like } = require('../models');

const getPostsBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    
    const validSubjects = ['Mathematics', 'Physics', 'Computer Science', 'English'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ message: 'Invalid subject' });
    }
    
    const posts = await ForumPost.findAll({
      where: { subject },
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts by subject:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.findAll({
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 30
    });
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching all posts:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await ForumPost.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        },
        {
          model: ForumReply,
          include: [
            {
              model: User,
              attributes: ['id', 'username']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    let userLiked = false;
    
    if (req.user) {
      const like = await Like.findOne({
        where: { 
          userId: req.user.id, 
          type: 'post', 
          targetId: post.id 
        }
      });
      userLiked = !!like;
    }
    
    const postJSON = post.toJSON();
    postJSON.userLiked = userLiked;
    
    if (req.user && postJSON.ForumReplies && postJSON.ForumReplies.length > 0) {
      const replyIds = postJSON.ForumReplies.map(reply => reply.id);
      const replyLikes = await Like.findAll({
        where: {
          userId: req.user.id,
          type: 'reply',
          targetId: replyIds
        }
      });
      
      const likedReplyIds = replyLikes.map(like => like.targetId);
      postJSON.ForumReplies = postJSON.ForumReplies.map(reply => ({
        ...reply,
        userLiked: likedReplyIds.includes(reply.id)
      }));
    }
    
    res.status(200).json(postJSON);
  } catch (error) {
    console.error('Error fetching post details:', error);
    res.status(500).json({ message: 'Server error fetching post details' });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, subject } = req.body;
    
    const validSubjects = ['Mathematics', 'Physics', 'Computer Science', 'English'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({ message: 'Invalid subject' });
    }
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }
    
    const userId = req.user.id;
    
    const newPost = await ForumPost.create({
      title,
      content,
      subject,
      userId
    });
    
    const postWithUser = await ForumPost.findByPk(newPost.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    res.status(201).json({
      message: 'Post created successfully',
      post: postWithUser
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

const createReply = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }
    
    const post = await ForumPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const newReply = await ForumReply.create({
      content,
      userId,
      postId: parseInt(postId)
    });
    
    const replyWithUser = await ForumReply.findByPk(newReply.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username']
        }
      ]
    });
    
    res.status(201).json({
      message: 'Reply created successfully',
      reply: replyWithUser
    });
  } catch (error) {
    console.error('Error creating reply:', error);
    res.status(500).json({ message: 'Server error creating reply' });
  }
};

const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;
    
    const post = await ForumPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const existingLike = await Like.findOne({
      where: {
        userId,
        type: 'post',
        targetId: postId
      }
    });
    
    if (existingLike) {
      await existingLike.destroy();
      await post.decrement('likes');
      await post.reload();
      
      return res.status(200).json({
        message: 'Like removed successfully',
        liked: false,
        likes: post.likes
      });
    }
    
    await Like.create({
      userId,
      type: 'post',
      targetId: parseInt(postId)
    });
    
    await post.increment('likes');
    await post.reload();
    
    res.status(201).json({
      message: 'Post liked successfully',
      liked: true,
      likes: post.likes
    });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error liking post' });
  }
};

const likeReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    const userId = req.user.id;
    
    const reply = await ForumReply.findByPk(replyId);
    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    
    const existingLike = await Like.findOne({
      where: {
        userId,
        type: 'reply',
        targetId: replyId
      }
    });
    
    if (existingLike) {
      await existingLike.destroy();
      await reply.decrement('likes');
      await reply.reload();
      
      return res.status(200).json({
        message: 'Like removed successfully',
        liked: false,
        likes: reply.likes
      });
    }
    
    await Like.create({
      userId,
      type: 'reply',
      targetId: parseInt(replyId)
    });
    
    await reply.increment('likes');
    await reply.reload();
    
    res.status(201).json({
      message: 'Reply liked successfully',
      liked: true,
      likes: reply.likes
    });
  } catch (error) {
    console.error('Error liking reply:', error);
    res.status(500).json({ message: 'Server error liking reply' });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = ['Mathematics', 'Physics', 'Computer Science', 'English'];
    res.status(200).json({ subjects });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ message: 'Server error fetching subjects' });
  }
};

module.exports = {
  getAllPosts,
  getPostsBySubject,
  getPostById,
  createPost,
  createReply,
  likePost,
  likeReply,
  getSubjects
};