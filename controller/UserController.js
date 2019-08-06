'use strict';

const UserService = require('../service/UserService');
const { validationResult } = require('express-validator');
const { body, param } = require('express-validator/check');

class UserController {
  constructor() {
    this.rules = [];
  }

  static validate(method) {
    // TODO: 需要抽取公用的
    switch (method) {
      case 'createUser':
        return [
          body('user_name')
            .isString()
            .withMessage('用户名必须是一个字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('用户名不能为空')
            .isLength({ min: 5 })
            .withMessage('用户名不能小于5位数')
            .escape(),
          body('password')
            .isString()
            .withMessage('密码必须是一个字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('密码不能为空'),
        ];
      case 'getUserById':
      case 'removeUserById':
        return [
          param('id')
            .exists()
            .withMessage('用户id必须存在')
            .isMongoId()
            .withMessage('非法的用户ID'),
        ];
      case 'updateUserById':
        return [
          body('user_name')
            .optional()
            .isString()
            .withMessage('用户名是一个字符串')
            .trim()
            .not()
            .isEmpty()
            .isLength({ min: 5 })
            .withMessage('用户名不能小于5位数')
            .escape(),
          body('password')
            .optional()
            .isString()
            .withMessage('密码必须是一个字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('密码不能为空'),
        ];
      default:
        return [];
    }
  }

  // 获取用户列表
  static async getUsers(req, res, next) {
    try {
      const result = await UserService.getUsers();
      await res.status(result.status).json({
        message: result.message,
        users: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  // 获取验证结果
  static validationResult(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(errors.array());
    }
  }

  // 新建用户
  static async createUser(req, res, next) {
    try {
      // 校验、转义html
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      const { user_name, password } = req.body;
      const result = await UserService.createUser({
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
      UserController.validationResult(req, res);
      const { id } = req.params;
      const result = await UserService.getUserById(id);
      const { status = 200, message, data } = result;
      res.status(status).send({
        message,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  // 根据用户 ID 删除用户
  static async removeUserById(req, res, next) {
    try {
      UserController.validationResult(req, res);
      const { id } = req.params;
      const result = await UserService.removeUserById(id);
      const { status = 200, message, data } = result;
      res.status(status).send({
        message,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserById(req, res, next) {
    try {
      UserController.validationResult(req, res);
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (user) {
        const result = await UserService.updateUserById(id, req.body);
        const { status = 200, message, data } = result;
        res.status(status).send({
          message,
          data,
        });
      } else {
        return res.status(404).send({
          message: '没有该用户',
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
