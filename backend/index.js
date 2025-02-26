const express = require('express');
const cors = require('cors');
const {sequelize, testConnection} = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config(); 

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth', authRoutes);

async function initializeServer() {
    try {
        await testConnection();
        await sequelize.sync({ force: false });
        console.log('Database tables synchronized successfully');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Example app listening at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize server:', error);
    }
}

initializeServer();