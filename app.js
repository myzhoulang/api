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

if (process.env.NODE_ENV !== 'development') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
  app.use(Sentry.Handlers.requestHandler());
}

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

// authenticated user
app.use('/api/user', require('./router/user'));

// users
app.use('/api/users', require('./router/users'));

// events
app.use('/api/events', require('./router/events'));

// news
app.use('/api/news', require('./router/news'));

// 文件上传
app.use('/api/upload', require('./router/upload'));

// 搜索
app.use('/api/search', require('./router/search'));

// 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found',
  });
});

if (process.env.NODE_ENV !== 'development') {
  app.use(Sentry.Handlers.errorHandler());
}

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
