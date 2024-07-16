// server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());

// Define routes
app.use('/api/review', require('./routes/review'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
