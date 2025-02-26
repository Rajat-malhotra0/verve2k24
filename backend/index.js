const express = require('express');
const cors = require('cors');
const {sequelize, testConnection} = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const forumRoutes = require('./routes/forumRoutes');
const botRoutes = require('./routes/botRoutes');
require('dotenv').config(); 

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend Root!');
});

app.use('/api/auth', authRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/bot', botRoutes);

async function initializeServer() {
    try {
        await testConnection();
        await sequelize.sync({ force: false });
        console.log('Database tables synchronized successfully');

        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`Example app listening at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize server:', error);
    }
}

initializeServer();