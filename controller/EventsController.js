'use strict';

const { body } = require('express-validator/check');
const EventService = require('../service/EventService');
const utils = require('../utils/utils');

class EventsController {
  constructor() {}

  // 根据 api动作获取api 检验规则
  static rules(method) {
    switch (method) {
      case 'createEvent':
        return EventsController.eventRule();
      case 'getEventById':
      case 'removeEventById':
        return [utils.validateId()];
      case 'updateEventById':
        return [utils.validateId(), ...EventsController.eventRule('update')];
      default:
        return [];
    }
  }

  static eventRule(type) {
    let title = body('title');
    let eventDate = body('event_date');
    let contents = body('contents');
    if (type === 'update') {
      title = title.optional();
      eventDate = eventDate.optional();
      contents = contents.optional();
    }
    return [
      title
        .isString()
        .withMessage('标题必须是一个字符串')
        .trim()
        .not()
        .isEmpty()
        .withMessage('标题不能为空')
        .isLength({ min: 5, max: 20 })
        .withMessage('标题不能小于5位数且小于20位数')
        .escape(),
      eventDate
        .trim()
        .not()
        .isEmpty()
        .withMessage('时间不能为空')
        .toDate()
        .isISO8601()
        .withMessage('非法的时间'),

      contents
        .isString()
        .withMessage('内容必须是字符串')
        .trim()
        .not()
        .isEmpty()
        .withMessage('内容不能为空'),
    ];
  }

  // 根据搜索条件搜索事件
  static async searchEvents(req, res, next) {
    try {
      const result = await EventService.getEvents(req.query);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 获取事件列表
  static async getEvents(req, res, next) {
    try {
      const result = await EventService.getEvents();
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 新建事件
  static async createEvent(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { title, event_date, contents } = req.body;
      const result = await EventService.createEvent({
        title,
        event_date,
        contents,
      });
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据事假 ID 获取事件详情
  static async getEventById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { id } = req.params;
      const result = await EventService.getEvnetById(id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据事件 ID 删除事件
  static async removeEventById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
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
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
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
