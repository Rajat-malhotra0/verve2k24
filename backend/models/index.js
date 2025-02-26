const User = require('./User');
const ForumPost = require('./ForumPost');
const ForumReply = require('./ForumReply');
const Like = require('./Like');

User.hasMany(ForumPost, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
ForumPost.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ForumReply, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
ForumReply.belongsTo(User, { foreignKey: 'userId' });

ForumPost.hasMany(ForumReply, {
    foreignKey: {
        name: 'postId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
ForumReply.belongsTo(ForumPost, { foreignKey: 'postId' });

User.hasMany(Like, {
    foreignKey: {
        name: 'userId',
        allowNull: false
    },
    onDelete: 'CASCADE'
});
Like.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    ForumPost,
    ForumReply,
    Like
};