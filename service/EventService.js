'use strict';
const { Event } = require('../model/event');

class EventService {
  static async getEvents(query = {}) {
    try {
      const events = await Event.find(query).select('title');
      return { data: events };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 获取用户信息
  static async getEvnetById(id) {
    try {
      const event = await Event.findById(id).select();
      if (event) {
        return { status: 200, data: event };
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
  static async createEvent(body) {
    let event;
    try {
      event = await Event.create(body);
      return { data: event };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 删除指定用户
  static async removeEventById(id) {
    try {
      await Event.deleteOne({ _id: id });
      return { status: 204 };
    } catch (e) {
      return { status: e.statusCode || 500, message: e.message };
    }
  }

  // 根据用户 ID 更新用户字段
  static async updateEventById(id, body) {
    try {
      const event = await Event.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true },
      );
      if (event) {
        return { data: event };
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

module.exports = EventService;
