'use strict';

const express = require('express');
const router = new express.Router();
const controller = require('../controller/UserController');

router
  // 获取用户列表
  .get('/', controller.getUsers)
  // 新增用户
  .post('/', controller.validate('createUser'), controller.createUser)
  // 根据 ID 获取指定用户
  .get('/:id', controller.validate('getUserById'), controller.getUserById)
  .delete(
    '/:id',
    controller.validate('removeUserById'),
    controller.removeUserById,
  )
  .patch(
    '/:id',
    controller.validate('updateUserById'),
    controller.updateUserById,
  );

module.exports = router;
