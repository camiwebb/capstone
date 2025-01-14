const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import and mount the router
const myRouter = require('./api');
app.use('/api', myRouter);

module.exports = app;