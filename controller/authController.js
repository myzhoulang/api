'use strict';

const authService = require('../service/authService');
const { validationResult } = require('express-validator');
module.exports = {
  async login(req, res, next) {
    try {
      // 校验、转义html
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return await res.json(errors.array());
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
};
