'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/UploadController');

router
// 获取用户列表
  .post('/', controller.upload);

module.exports = router;
