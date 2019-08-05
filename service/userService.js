'use strict';

const { User } = require('../model/user');
const utils = require('../utils/utils');

module.exports = {
  // 获取用户列表
  async getUsers() {
    try {
      const users = await User.find().select('_id user_name');
      return utils.success(200, users);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  },

  async getUserByUserName(userName) {
    try {
      const user = await User.findOne({ user_name: userName }).select(
        '_id user_name',
      );
      return utils.success(200, user);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  },

  async getUserById(id) {
    try {
      const user = await User.findById(id).select('_id user_name');
      return utils.success(200, user);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  },

  // 新增用户
  async createUser(body) {
    let user;
    try {
      user = await User.findOne({ user_name: body.user_name });
      if (!user) {
        user = await User.create(body);
        return utils.success(200, user);
      } else {
        return utils.error(409, '用户名称重复');
      }
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  },
};
