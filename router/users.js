'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/UsersController');

router
  // 获取用户列表
  .get('/', controller.rules('getUsers'), controller.getUsers)
  // 新增用户
  .post('/', controller.rules('createUser'), controller.createUser)
  // 根据 ID 获取指定用户
  .get('/:id', controller.rules('getUserById'), controller.getUserById)
  .delete(
    '/:id',
    controller.rules('removeUserById'),
    controller.removeUserById,
  )
  .patch(
    '/:id',
    controller.rules('updateUserById'),
    controller.updateUserById,
  );

module.exports = router;
