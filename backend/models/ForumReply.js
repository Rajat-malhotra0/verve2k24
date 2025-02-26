const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ForumReply = sequelize.define('ForumReply', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: true
});

module.exports = ForumReply;