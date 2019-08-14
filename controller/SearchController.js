'use strict';

const UserService = require('../service/UserService');
const NewsService = require('../service/NewsService');
const EventService = require('../service/EventService');
const utils = require('../utils/utils');

class SearchController {
  constructor() {}

  // 根据api动作返回相应的规则
  static rules(type) {
    switch (type) {
      case 'users':
        return [...utils.validatePage()];
      case 'news':
        return [...utils.validatePage()];
      case 'events':
        return [...utils.validatePage()];
    }
  }

  // 搜索用户
  static async getUsers(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      // 搜索用户列表
      const { page = 1, pageSize = 10, query = {} } = req.query;
      const result = await UserService.getUsers({
        since: (page - 1) * pageSize,
        counts: pageSize,
        query,
      });
      res.status(200).send({
        users: result.data,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  // 搜索新闻
  static async getNews(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      // 搜索用户列表
      const { page = 1, pageSize = 10, query = {} } = req.query;
      const result = await NewsService.getNews({
        since: (page - 1) * pageSize,
        counts: pageSize,
        query,
      });
      res.status(200).send({
        users: result.data,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }

  // 搜索事件
  static async getEvents(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      // 搜索用户列表
      const { page = 1, pageSize = 10, query = {} } = req.query;
      const result = await EventService.getEvents({
        since: (page - 1) * pageSize,
        counts: pageSize,
        query,
      });
      res.status(200).send({
        events: result.data,
        total: result.total,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SearchController;
