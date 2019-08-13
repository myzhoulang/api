'use strict';

const UserService = require('../service/UserService');
const utils = require('../utils/utils');
class UserController {
  // 获取登录用户信息
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

  // 更新登录用户信息
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
