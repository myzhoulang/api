'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/NewsController');

router
  // 获取用户列表
  .get('/', controller.rules('getNews'), controller.getNews)
  // 新增用户
  .post('/', controller.rules('createNews'), controller.createNews)
  // 根据 ID 获取指定用户
  .get('/:id', controller.rules('getNewsById'), controller.getNewsById)
  .delete(
    '/:id',
    controller.rules('removeNewsById'),
    controller.removeNewsById,
  )
  .patch(
    '/:id',
    controller.rules('updateNewsById'),
    controller.updateNewsById,
  );

module.exports = router;
