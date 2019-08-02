'use strict';

const express = require('express');
const router = new express.Router();
const userController = require('../controller/userController');
const { createUserBodyValidator } = require('../middleware/user');

router
    .get('/', userController.getUsers)
    .post('/', createUserBodyValidator(), userController.createUser);

module.exports = router;
