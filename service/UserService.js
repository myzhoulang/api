'use strict';
const { User } = require('../model/user');

class UserService {
  // 获取用户列表
  static async getUsers(params = { since: 0, counts: 30, query: {} }) {
    try {
      const { since, counts, query } = params;
      const [users, total] = await Promise.all([
        User.find(query)
          .skip(since)
          .limit(counts)
          .select('_id user_name'),
        User.countDocuments(query),
      ]);
      return { data: users, total: total };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户名称获取指定用户
  // 获取单个
  static async getUserByUserName(userName) {
    try {
      const user = await User.findOne({ user_name: userName }).select(
        '_id user_name',
      );
      return { data: user };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 获取用户信息
  static async getUserById(id) {
    try {
      const user = await User.findById(id).select('_id user_name');
      return { status: 200, data: user };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 新增用户
  static async createUser(body) {
    let user;
    try {
      user = await User.findOne({ user_name: body.user_name });
      if (!user) {
        const { _id, user_name } = await User.create(body);

        return { data: { _id, user_name } };
      } else {
        return { status: 409, message: '用户名重复' };
      }
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 删除指定用户
  static async removeUserById(id) {
    try {
      await User.deleteOne({ _id: id });
      return { status: 204 };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 更新用户字段
  static async updateUserById(id, body) {
    try {
      const { data: user } = await UserService.getUserByUserName(
        body.user_name,
      );
      if (user && user._id.toString() !== id) {
        return { status: 409, message: '用户名重复' };
      }
      const { _id, user_name } = await User.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true },
      );

      return { data: { _id, user_name } };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }
}

module.exports = UserService;
