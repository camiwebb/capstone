const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const myRouter = require('./api');
app.use('/api', myRouter);

module.exports = app;