const express = require('express');
const app = express();

// Middleware
app.use(express.json());

const myRouter = require('./api');
app.use('/api', myRouter);

module.exports = app;