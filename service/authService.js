'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../model/user');
const utils = require('../utils/utils');

module.exports = {
  async login(body) {
    try {
      const user = await User.findOne({
        user_name: body.user_name,
      }).select('user_name password');

      if (!user) {
        return utils.error(401, '账号或密码错误');
      }
      const isUserValid = await bcrypt.compareSync(
        body.password,
        user.password,
      );
      if (!isUserValid) {
        return { status: 401, message: '账号或密码错误' };
      }
      const token = jwt.sign(
        {
          id: String(user._id),
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1h',
        },
      );
      return { data: token };
    } catch (error) {
      return { status: 500, message: error.message };
    }
  },
};
