'use strict';

const userService = require('../service/userService');
const { validationResult } = require('express-validator');
const { body } = require('express-validator/check');

class UserController {
  constructor() {
    this.rules = [];
  }

  static validate(method) {
    switch (method) {
      case 'createUser':
        return [
          body('user_name')
            .trim()
            .not()
            .isEmpty()
            .withMessage('用户名不能为空')
            .isLength({ min: 5 })
            .withMessage('用户名不能小于5位数')
            .escape(),
          body('password')
            .trim()
            .not()
            .isEmpty()
            .withMessage('密码不能为空'),
        ];
        break;

      default:
        break;
    }
  }

  // 获取用户列表
  static async getUsers(req, res, next) {
    try {
      const result = await userService.getUsers();
      await res.status(result.status).json({
        message: result.message,
        user: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  // 新建用户
  static async createUser(req, res, next) {
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
  }

  // 根据用户 ID 获取用户信息
  static async getUserById(req, res, next) {
    try {
      // 校验、转义html
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      const { id } = req.params;
      const result = await userService.getUserById(id);
      const { status = 200, message, data } = result;
      res.status(status).send({
        message,
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
