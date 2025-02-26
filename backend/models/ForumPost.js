const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const ForumPost = sequelize.define('ForumPost', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    subject: {
        type: DataTypes.ENUM('Mathematics', 'Physics', 'Computer Science', 'English'),
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {timestamps: true});

module.exports = ForumPost;