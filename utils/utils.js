const { validationResult } = require('express-validator');
const { param, query } = require('express-validator/check');

module.exports = {
  makeResult({ message, errors, status = 200, data }) {
    if (status >= 200 && status < 300) {
      return data;
    }
    return {
      message,
      errors,
    };
  },

  validate(req, res) {
    // 校验、转义html
    const errors = validationResult(req, res);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return false;
    }
    return true;
  },

  validateId() {
    return param('id')
      .trim()
      .not()
      .isEmpty()
      .withMessage('id必须存在')
      .isMongoId()
      .withMessage('非法的用户ID');
  },

  // 校验传递的分页参数
  validatePage() {
    return [
      query('page')
        .optional()
        .toInt()
        .isInt()
        .withMessage('非法的数字'),
      query('pageSize')
        .optional()
        .toInt()
        .isInt()
        .withMessage('非法的数字'),
    ];
  },

  // 校验获取列表参数
  validateLists() {
    return [
      query('since')
        .optional()
        .toInt()
        .isInt()
        .withMessage('非法的数字'),
      query('counts')
        .optional()
        .toInt()
        .isInt()
        .withMessage('非法的数字'),
    ];
  },
};
