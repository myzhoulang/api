'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user = new mongoose.Schema(
  {
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
      require: true,
      select: false,
      set(val) {
        // 密码加盐
        return bcrypt.hashSync(val, 10);
      },
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'update_at' } },
);

const User = mongoose.model('User', user);
module.exports = { User };
