'use strict';

const UserService = require('../service/UserService');
const utils = require('../utils/utils');

const { body } = require('express-validator/check');
class UsersController {
  constructor() {}

  // 根据 api动作获取api 检验规则
  static rules(method) {
    switch (method) {
      case 'createUser':
        return UsersController.userRule();
      case 'getUserById':
      case 'removeUserById':
        return [utils.validateId()];
      case 'updateUserById':
        return [utils.validateId(), ...UsersController.userRule('update')];
      default:
        return [];
    }
  }

  static userRule(type) {
    let userName = body('user_name');
    let password = body('password');

    if (type === 'update') {
      userName = userName.optional();
      password = password.optional();
    }
    return [
      userName
        .isString()
        .withMessage('用户名是一个字符串')
        .trim()
        .not()
        .isEmpty()
        .withMessage('用户名不能为空')
        .isLength({ min: 5 })
        .withMessage('用户名不能小于5位数')
        .escape(),
      password
        .isString()
        .withMessage('密码必须是一个字符串')
        .trim()
        .not()
        .isEmpty()
        .withMessage('密码不能为空'),
    ];
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

  // 根据用户 ID 更新用户信息
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
