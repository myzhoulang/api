'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/UserController');

router
// 获取用户列表
  .get('/', controller.getUser)
  .patch(
    '/',
    controller.updateUserById,
  );

module.exports = router;
