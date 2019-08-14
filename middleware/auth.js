'use strict';

const { check } = require('express-validator');
module.exports = {
  loginBodyValidator() {
    return [
      check('user_name')
        .trim()
        .not()
        .isEmpty()
        .escape(),
      check('password')
        .trim()
        .not()
        .isEmpty()
        .withMessage('密码不能为空'),
    ];
  },
};
