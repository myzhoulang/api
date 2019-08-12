'use strict';
const { News } = require('../model/news');

class NewsService {
  static async getNews(query = {}) {
    try {
      const news = await News.find(query).select('user_name');
      return { data: news };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 获取用户信息
  static async getNewsById(id) {
    try {
      const news = await News.findById(id).select();
      if (news) {
        return { status: 200, data: news };
      } else {
        return {
          status: 404,
          message: '未找到该新闻',
        };
      }
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 添加新闻
  static async createNews(body) {
    let news;
    try {
      news = await News.create(body);
      return { data: news };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 删除指定用户
  static async removeNewsById(id) {
    try {
      await News.deleteOne({ _id: id });
      return { status: 204 };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 更新用户字段
  static async updateNewsById(id, body) {
    try {
      const news = await News.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true },
      );
      if (news) {
        return { data: news };
      } else {
        return {
          status: 404,
          message: '未找到该新闻',
        };
      }
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }
}

module.exports = NewsService;
