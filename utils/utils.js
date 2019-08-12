const { validationResult } = require('express-validator');

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
      res.status(422).json(errors.array());
      return false;
    }
    return true;
  },
};
