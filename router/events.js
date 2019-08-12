'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/EventsController');

router
// 搜索
  .get('/search', controller.searchEvents)
  // 获取用户列表
  .get('/', controller.getEvents)
  // 新增用户
  .post('/', controller.validate('createEvents'), controller.createEvents)
  // 根据 ID 获取指定用户
  .get('/:id', controller.validate('getEventById'), controller.getEventById)
  .delete(
    '/:id',
    controller.validate('removeEventById'),
    controller.removeEventById,
  )
  .patch(
    '/:id',
    controller.validate('updateEventById'),
    controller.updateEventById,
  );

module.exports = router;
