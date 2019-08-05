'use strict';

const { check } = require('express-validator');
module.exports = {
  loginBodyValidator() {
    return [
      check('user_name')
        .trim()
        .not()
        .isEmpty()
        .withMessage('用户名不能为空')
        .isLength({ min: 5 })
        .withMessage('用户名不能小于5位数')
        .escape(),
      check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('密码不能为空'),
    ];
  },
};
