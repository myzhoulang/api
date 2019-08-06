'use strict';

const { User } = require('../model/user');
const utils = require('../utils/utils');

class UserService {
  static async getUsers() {
    try {
      const users = await User.find().select('_id user_name');
      return utils.success(200, users);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  }

  // 根据用户名称获取指定用户
  // 获取单个
  static async getUserByUserName(userName) {
    try {
      const user = await User.findOne({ user_name: userName }).select(
        '_id user_name',
      );
      return utils.success(200, user);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  }

  // 根据用户 ID 获取用户信息
  static async getUserById(id) {
    try {
      const user = await User.findById(id).select('_id user_name');
      return utils.success(200, user);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  }

  // 新增用户
  static async createUser(body) {
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
  }

  // 根据用户 ID 删除指定用户
  static async removeUserById(id) {
    try {
      await User.deleteOne({ _id: id });
      return utils.success(204);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  }

  // 根据用户 ID 更新用户字段
  static async updateUserById(id, body) {
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true },
      );
      return utils.success(200, user);
    } catch (e) {
      return utils.error(e.statusCode, e.message);
    }
  }
}

module.exports = UserService;
