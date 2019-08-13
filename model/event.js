'use strict';

const mongoose = require('mongoose');

// 公司发展历史事件
const event = new mongoose.Schema(
  {
    // 事件标题
    title: {
      // 数据类型
      type: String,
      // 必填
      require: true,
    },

    // 创建人
    creater: {
      type: String,
      require: true,
    },

    // 更新人
    updater: {
      type: String,
      default: '',
    },

    // 事件时间
    event_date: {
      type: Date,
      require: true,
    },

    // 事件内容 可多事件
    contents: {
      type: String,
      require: true,
    },

    __v: {
      type: Number,
      select: false,
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'update_at' } },
);

const Event = mongoose.model('Event', event);
module.exports = { Event };
