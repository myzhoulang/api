'use strict';

const UserService = require('../service/UserService');
const utils = require('../utils/utils');

const { body, param } = require('express-validator/check');
class UsersController {
  constructor() {}

  static rules(method) {
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
            .trim()
            .not()
            .isEmpty()
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
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 新建用户
  static async createUser(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { user_name, password } = req.body;
      const result = await UserService.createUser({
        user_name,
        password,
      });
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据用户 ID 获取用户信息
  static async getUserById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { id } = req.params;
      const result = await UserService.getUserById(id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据用户 ID 删除用户
  static async removeUserById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { id } = req.params;
      const result = await UserService.removeUserById(id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  static async updateUserById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      if (user) {
        const result = await UserService.updateUserById(id, req.body);
        const { status = 200 } = result;
        res.status(status).send(utils.makeResult(result));
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

module.exports = UsersController;
