'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const expressJwt = require('express-jwt');
const Sentry = require('@sentry/node');
const logger = require('./middleware/logger');
const { connect } = require('./utils/db');
const app = express();
const port = process.env.PORT || 3000;

Sentry.init({
  dsn: 'http://3bd63b641eae448e9e71756d2e7e3955@47.98.62.21:9000/5',
});
app.use(Sentry.Handlers.requestHandler());

const authController = require('./controller/authController');
const { loginBodyValidator } = require('./middleware/auth');

// connect mongodb
connect();

// logger middleware
app.use(logger.successLogger);
app.use(logger.failLogger);

// set safe headers
app.use(helmet());

// cors middle ware
app.use(cors());

// JSON parse middle ware
app.use(express.json());

// validator is login
app.use(
  expressJwt({ secret: process.env.JWT_SECRET }).unless({
    path: ['/api/login'],
  }),
);

// login
app.post('/api/login', loginBodyValidator(), authController.login);

// users
app.use('/api/users', require('./router/user'));

// 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

app.use(Sentry.Handlers.errorHandler());

// error
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});
// listen port
app.listen(port, () => {
  console.log(`Server is Running port: ${port}`);
});
