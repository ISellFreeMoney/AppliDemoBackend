const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// Connection to MongoDB
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USERNAME_PASS}@applidemo.mvav8we.mongodb.net/test`
    )
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Failed to connect MongoDB', err));