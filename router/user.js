'use strict';

const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');

router
  .get('/', UserController.getUsers)
  .post('/', UserController.validate('createUser'), UserController.createUser)
  .get('/:id');

module.exports = router;
