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
      });
      if (!user) {
        return utils.error(401, '账号或密码错误');
      }
      const isUserValid = await bcrypt.compareSync(
          body.password,
          user.password,
      );
      if (!isUserValid) {
        return utils.error(401, '账号或密码错误');
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
      return utils.success(200, token);
    } catch (error) {
      return utils.error(500, error.message);
    }
  },
};
