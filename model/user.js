'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user = new mongoose.Schema({
  user_name: {
    // 数据类型
    type: String,
    // 必填
    require: true,
    // 必须唯一
    unique: true,
  },

  __v: {
    type: Number,
    select: false,
  },

  password: {
    type: String,
    set(val) {
      // 密码加盐
      return bcrypt.hashSync(val, 10);
    },
  },
});

const User = mongoose.model('User', user);
module.exports = { User };
