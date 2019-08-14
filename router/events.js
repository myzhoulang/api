'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/EventsController');

router
// 获取用户列表
  .get('/', controller.rules('getEvents'), controller.getEvents)
  // 新增用户
  .post('/', controller.rules('createEvent'), controller.createEvent)
  // 根据 ID 获取指定用户
  .get('/:id', controller.rules('getEventById'), controller.getEventById)
  .delete(
    '/:id',
    controller.rules('removeEventById'),
    controller.removeEventById,
  )
  .patch(
    '/:id',
    controller.rules('updateEventById'),
    controller.updateEventById,
  );

module.exports = router;
