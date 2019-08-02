'use strict';

const userService = require('../service/userService');
const { validationResult } = require('express-validator');

module.exports = {
  async getUsers(req, res, next) {
    try {
      const result = await userService.getUsers();
      await res.status(result.status).json({
        message: result.message,
        user: result.data,
      });
    } catch (error) {
      next(error);
    }
  },

  async createUser(req, res, next) {
    try {
      // 校验、转义html
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      const { user_name, password } = req.body;
      const result = await userService.createUser({
        user_name,
        password,
      });
      const { status = 200, message, data } = result;
      res.status(status).send({
        message,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
