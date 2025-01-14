require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { user, restStop, review, comment } = require('../db/seed.js');


const SECRET_KEY = process.env.SECRET_KEY;


// Verify token for routes requiring authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'User not authenticated' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};


// Register route
router.post('/api/auth/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body; 

    const existingUser = await user.findOne({where: { username } });
    if (existingUser) return res.status(400).json({message: 'Username already exists'});

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({ username, email, password: hashedPassword});

    res.status(201).json({ message: 'User created successfully', user: newUser});
  } catch (err) {
    next(err);
  }
});

// Login route
router.post('/api/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await user.findOne({ where: {username} });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'You have successfully logged in', token });
  } catch (err) {
    next(err);
  }
});

// Get logged-in user
router.get('/api/auth/me', (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'User not authenticated' });

    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ userId: decoded.userId });
  } catch (err) {
    next(err);
  }
});

// Get all rest stops
router.get('/api/rest-stops', async (req, res, next) => {
  try {
    const result = await client.query('SELECT * FROM rest_stops');
    res.status(200).json(result.rows);
  } catch (err) {
    next(err);
  }
});

// Get details for specific rest stop
router.get('/api/rest-stops/:itemId', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const restStop = await restStop.findByPk(itemId);

    if (!restStop) return res.status(404).json({ message: 'Rest stop not found' });

    res.status(200).json(restStop);
  } catch (err) {
    next(err);
  }
});

// Get reviews for specific rest stop
router.get('/api/rest-stops/:itemId/reviews', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const reviews = await review.findAll({ where: { location_id: itemId } });
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});

// Post a review for a rest stop
router.post('/api/rest-stops/:itemId/reviews', authenticateUser, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.userId;

    const newReview = await review.create({
      user_id: userId, 
      location_id: itemId, 
      rating, 
      review_text: reviewText
    });

    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
});

// Get all reviews posted by logged-in user
router.get('/api/reviews/me', authenticateUser, async (req, res, next) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const reviews = await review.findAll({ where: {user_id: decoded.userId} });

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});

// Update a review
router.put('/api/rest-stops/:itemId/reviews/:reviewId', authenticateUser, async (req, res, next) => {
  try { 
    const { reviewId, itemId } = req.params;
    const { rating, reviewText } = req.body;
    
    const review = await review.findOne({ where: { id: reviewId, location_id: itemId } });
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user_id !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this review' });
    }

    review.rating = rating;
    review.review_text = reviewText;
    await review.save();

    res.status(200).json(review);
  } catch (err) {
    next(err);
  }
});

// Post a comment on a review
router.post('/api/rest-stops/:itemId/reviews/:reviewId/comments', authenticateUser, async (req, res, next) => {
  try {
    const { reviewId } = req.params; 
    const userId = req.userId;
    const { commentText } = req.body;

    const newComment = await comment.create({
      review_id: reviewId, 
      user_id: userId, 
      comment_text: commentText
    });

    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
});

// Update a comment
router.put('/api/users/:userId/comments/:commentId', authenticateUser, async (req, res, next) => {
  try {
    const { userId, commentId } = req.params; 
    const { commentText } = req.body;

    const comment = await comment.findOne({ where: { id: commentId, user_id: userId } });
    if (!comment) return res.status(404).json({ message: 'Comment not found'});

    comment.comment_text = commentText; 
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    next(err);
  }
});

// Delete a comment
router.delete('/api/users/:userId/comments/:commentId', authenticateUser, async (req, res, next) => {
  try {
    const { userId, commentId } = req.params;
    const comment = await comment.findOne({ where: { id: commentId, user_id: userId } });

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user_id !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment' });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Delete a review
router.delete('/api/users/:userId/reviews/:reviewId', authenticateUser, async (req, res, next) => {
  try {
    const { userId, reviewId } = req.params;
    const review = await review.findOne({ where: { id: reviewId, user_id: userId } });

    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.user_id !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this review' });
    }

    await review.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;