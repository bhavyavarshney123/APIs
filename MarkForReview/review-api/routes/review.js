// routes/review.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Review Schema
const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Item'
  },
  reviewText: String,
  rating: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

// Create Review Model
const Review = mongoose.model('Review', ReviewSchema);

// @route   POST api/review
// @desc    Mark an item for review
// @access  Public
router.post('/', async (req, res) => {
  const { userId, itemId, reviewText, rating } = req.body;

  try {
    let review = new Review({ userId, itemId, reviewText, rating });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
