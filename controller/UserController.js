'use strict';

const UserService = require('../service/UserService');
const utils = require('../utils/utils');
class UserController {
  constructor() {
    this.rules = [];
  }

  // 获取用户列表
  static async getUser(req, res, next) {
    try {
      const authUser = req.user;
      const result = await UserService.getUserById(authUser.id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  static async updateUserById(req, res, next) {
    try {
      const authUser = req.user;
      const user = await UserService.getUserById(authUser.id);
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

module.exports = UserController;
