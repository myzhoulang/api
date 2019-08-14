'use strict';

const authService = require('../service/authService');
const utils = require('../utils/utils');

module.exports = {
  async login(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { user_name, password } = req.body;
      const result = await authService.login({
        user_name,
        password,
      });
      const { status = 200, data: token, message } = result;
      res.status(status).send({ token, message });
    } catch (error) {
      next(error);
    }
  },
  async logout(req, res, next) {},
};
