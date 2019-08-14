'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/SearchController');

router
  // 搜索用户列表
  .get('/users', controller.rules('users'), controller.getUsers)
  .get('/news', controller.rules('news'), controller.getNews)
  .get('/events', controller.rules('events'), controller.getEvents);

module.exports = router;
