const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/database');

const User = sequelize.define('User', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {timestamps: true,
    
    toJSON: {
        transform: function (doc, plain) {
            delete plain.password;
            return plain;
        }
    }
})

module.exports = User;