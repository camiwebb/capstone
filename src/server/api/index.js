require('dotenv').config();
const express = require('express');
const client = require('../db/client');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const { user, restStop, review, comment } = require('../db/seed.js');


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
router.post('/auth/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Login route
router.post('/auth/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'You have successfully logged in', token });
  } catch (err) {
    next(err);
  }
});

// Get logged-in user
router.get('/auth/me', authenticateUser, async (req, res, next) => {
  try {
    const user = await client.query('SELECT * FROM users WHERE id = $1', [req.userId]);

    if (!user.rows.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.rows[0]);
  } catch (err) {
    next(err);
  }
});

// Get all rest stops
router.get('/rest-stops', async (req, res, next) => {
  try {
    const result = await client.query('SELECT * FROM rest_stops');
    const restStops = result.rows;

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No rest stops found' });
    }

    res.status(200).json(restStops);
  } catch (err) {
    next(err);
  }
});

// Get details for specific rest stop
router.get('/rest-stops/:id', async (req, res, next) => {
  const { id } = req.params;
  console.log(`Looking for rest stop with ID: ${id}`);

  try {
    const result = await client.query('SELECT * FROM rest_stops WHERE id = $1::uuid', [id]);
    console.log('Query result:', result.rows);

    const restStop = result.rows[0];

    if (!restStop) {
      return res.status(404).json({ message: 'Rest stop not found' });
    }

    res.status(200).json(restStop);
  } catch (err) {
    next(err);
  }
});

// Add a new rest stop
router.post('/rest-stops', async (req, res, next) => {
  try {
      const { name, description, rating } = req.body;

      if (!name || !description || !rating ) {
        return res.status(400).json({ message: 'Missing required fields'})
      }

      const result = await client.query(
        'INSERT INTO rest_stops (name, description, average_rating) VALUES ($1, $2, $3) RETURNING *',
        [name, description, rating]
      );

      const newRestStop = result.rows[0];
      res.status(201).json({ message: 'Rest stop created successfully', restStop: newRestStop });
  } catch (err) {
    next(err);
  }
});

// Get reviews for specific rest stop
router.get('/rest-stops/:itemId/reviews', async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const result = await client.query('SELECT * FROM reviews WHERE location_id = $1', [itemId]);
    const reviews = result.rows;

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});

// Post a review for a rest stop
router.post('/rest-stops/:itemId/reviews', authenticateUser, async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.userId;

    const result = await client.query(
      'INSERT INTO reviews (user_id, location_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, itemId, rating, reviewText]
    );

    const newReview = result.rows[0];
    res.status(201).json(newReview);

  } catch (err) {
    next(err);
  }
});

// Get all reviews posted by logged-in user
router.get('/reviews/me', authenticateUser, async (req, res, next) => {
  try {
    const result = await client.query('SELECT * FROM reviews WHERE user_id = $1', [req.userId]);
    const reviews = result.rows;

    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
});

// Update a review
router.put('/reviews/:reviewId', authenticateUser, async (req, res, next) => {
  try {
    const { reviewId, itemId } = req.params;
    const { rating, reviewText } = req.body;
    const userId = req.userId;

    const reviewResult = await client.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [reviewId, userId]
    );
    const review = reviewResult.rows[0];

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you do not have permission to update it' });
    }

    const updatedReviewResult = await client.query(
      'UPDATE reviews SET rating = $1, review_text = $2 WHERE id = $3 RETURNING *',
      [rating, reviewText, reviewId]
    );

    const updatedReview = updatedReviewResult.rows[0];
    res.status(200).json(updatedReview);
  } catch (err) {
    next(err);
  }
});

// Post a comment on a review
router.post('/reviews/:reviewId/comments', authenticateUser, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { commentText } = req.body;
    const userId = req.userId;

    const result = await client.query(
      'INSERT INTO comments (review_id, user_id, comment_text) VALUES ($1, $2, $3) RETURNING *',
      [reviewId, userId, commentText]
    );

    const newComment = result.rows[0];
    res.status(201).json(newComment);
  } catch (err) {
    next(err);
  }
});

// Update a comment
router.put('/comments/:commentId', authenticateUser, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { commentText } = req.body;
    const userId = req.userId;

    const commentResult = await client.query(
      'SELECT * FROM comments WHERE id = $1 AND user_id = $2',
      [commentId, userId]
    );
    const comment = commentResult.rows[0];

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or you do not have permission to update it' });
    }

    const updatedCommentResult = await client.query(
      'UPDATE comments SET comment_text = $1 WHERE id = $2 RETURNING *',
      [commentText, commentId]
    );

    const updatedComment = updatedCommentResult.rows[0];
    res.status(200).json(updatedComment);
  } catch (err) {
    next(err);
  }
});

// Delete a comment
router.delete('/comments/:commentId', authenticateUser, async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    // Check if the comment exists and belongs to the logged-in user
    const commentResult = await client.query(
      'SELECT * FROM comments WHERE id = $1 AND user_id = $2',
      [commentId, userId]
    );
    const comment = commentResult.rows[0];

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found or you do not have permission to delete it' });
    }

    // Delete the comment
    await client.query('DELETE FROM comments WHERE id = $1', [commentId]);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Delete a review
router.delete('/reviews/:reviewId', authenticateUser, async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    // Check if the review exists and belongs to the logged-in user
    const reviewResult = await client.query(
      'SELECT * FROM reviews WHERE id = $1 AND user_id = $2',
      [reviewId, userId]
    );
    const review = reviewResult.rows[0];

    if (!review) {
      return res.status(404).json({ message: 'Review not found or you do not have permission to delete it' });
    }

    // Delete the review
    await client.query('DELETE FROM reviews WHERE id = $1', [reviewId]);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;