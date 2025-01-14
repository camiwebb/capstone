const express = require('express');
const app = express();

// Example API Route
app.get('/api/rest-stops', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Mountain View Rest Stop',
      description: 'A scenic stop with great views of the mountains.',
      average_rating: 4.8,
    },
    {
      id: 2,
      name: 'Forest Retreat Rest Stop',
      description: 'A quiet spot surrounded by lush greenery.',
      average_rating: 4.5,
    },
    {
      id: 3,
      name: 'Sunny Trails Rest Stop',
      description: 'Perfect for stretching your legs on a sunny day.',
      average_rating: 4.2,
    },
  ]);
});

// Additional middleware, routes, etc.

module.exports = app; // This should export the Express app
