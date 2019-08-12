'use strict';

const { validationResult } = require('express-validator');
const { body, param } = require('express-validator/check');
const EventService = require('../service/EventService');
const utils = require('../utils/utils');

class EventsController {
  constructor() {
    this.rules = [];
  }

  static validate(method) {
    switch (method) {
      case 'createNews':
        return [
          body('title')
            .isString()
            .withMessage('标题必须是一个字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('标题不能为空')
            // .isLength({ min: 5 })
            // .withMessage('标题不能小于5位数')
            .escape(),
          body('cover')
            .isString()
            .withMessage('新闻封面必须是一个字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('新闻封面必须是存在')
            .isURL()
            .withMessage('新闻是非法的url地址'),

          body('details')
            .isString()
            .withMessage('新闻内容必须是字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('新闻内容不能为空'),
        ];
      case 'getNewsById':
      case 'removeNewsById':
        return [
          param('id')
            .trim()
            .not()
            .isEmpty()
            .withMessage('用户id必须存在')
            .isMongoId()
            .withMessage('非法的用户ID'),
        ];
      case 'updateNewsById':
        return [
          body('title')
            .optional()
            .isString()
            .withMessage('标题是一个字符串')
            .trim()
            .not()
            .isEmpty()
            // .isLength({ min: 5 })
            // .withMessage('标题不能小于5位数')
            .escape(),
          body('cover')
            .optional()
            .isString()
            .withMessage('新闻封面必须是一个字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('新闻封面必须是存在')
            .isURL()
            .withMessage('新闻封面是非法的url地址'),
          body('details')
            .optional()
            .isString()
            .withMessage('新闻内容必须是字符串')
            .trim()
            .not()
            .isEmpty()
            .withMessage('新闻内容不能为空'),
        ];
      default:
        return [];
    }
  }

  static async searchEvents(req, res, next) {
    try {
      const result = await EventService.getEvents(req.query);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 获取用户列表
  static async getEvents(req, res, next) {
    try {
      const result = await EventService.getEvents();
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 新建用户
  static async createEvent(req, res, next) {
    try {
      // 校验、转义html
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      const { title, event_date, contents } = req.body;
      const result = await EventService.createEvent({
        title,
        event_date,
        // 文章内容安全过滤 危险属性和标签
        contents,
      });
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据用户 ID 获取用户信息
  static async getEventById(req, res, next) {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      const { id } = req.params;
      const result = await EventService.getEvnetById(id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据用户 ID 删除用户
  static async removeEventById(req, res, next) {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      const { id } = req.params;
      const result = await EventService.removeEventById(id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 更新事件
  static async updateEventById(req, res, next) {
    try {
      const errors = validationResult(req, res);
      if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
      }
      const { id } = req.params;
      const user = await EventService.getEvnetById(id);
      if (user) {
        const result = await EventService.updateEventById(id, req.body);
        const { status = 200 } = result;
        res.status(status).send(utils.makeResult(result));
      } else {
        return res.status(404).send({
          message: '新闻不存在',
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EventsController;
