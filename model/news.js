'use strict';

const mongoose = require('mongoose');
const news = new mongoose.Schema(
  {
    // 新闻标题
    title: {
      // 数据类型
      type: String,
      // 必填
      require: true,
    },

    // 新闻封面
    cover: {
      type: String,
      require: true,
    },

    // 发布时间
    publish_time: {
      type: Date,
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

    // 发布人
    publisher: {
      type: String,
      default: '',
    },

    // 新闻详情
    details: {
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

const News = mongoose.model('News', news, 'news');
module.exports = { News };
