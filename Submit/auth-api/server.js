// server.js
const express = require('express');
const connectDB = require('./db');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(bodyParser.json());

// Routes
app.post('/submit', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during /submit:', err.message);
    res.status(500).send('Server error');
  }
});

// Registration Route (for testing purposes)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Error during /register:', err.message);
    res.status(500).send('Server error');
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
