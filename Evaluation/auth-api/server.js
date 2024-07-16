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
app.get('/evaluation', async (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Error during /evaluation:', err.message);
    res.status(500).send('Server error');
  }
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({ username, password });

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
