'use strict';
const { body } = require('express-validator/check');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const NewsService = require('../service/NewsService');
const utils = require('../utils/utils');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

class NewsController {
  constructor() {}

  // 根据 api动作获取api 检验规则
  static rules(method) {
    switch (method) {
      case 'getNews':
        return [...utils.validateLists()];
      case 'createNews':
        return NewsController.newsRule();
      case 'getNewsById':
      case 'removeNewsById':
        return [utils.validateId()];
      case 'updateNewsById':
        return [utils.validateId(), ...NewsController.newsRule('update')];
      default:
        return [];
    }
  }

  // 新增/更新新闻的规则
  static newsRule(type) {
    let title = body('title');
    let cover = body('cover');
    let details = body('details');
    if (type === 'update') {
      title = title.optional();
      cover = cover.optional();
      details = details.optional();
    }
    return [
      title
        .isString()
        .withMessage('标题必须是一个字符串')
        .trim()
        .not()
        .isEmpty()
        .withMessage('标题不能为空')
        // .isLength({ min: 5 })
        // .withMessage('标题不能小于5位数')
        .escape(),
      cover
        .isString()
        .withMessage('新闻封面必须是一个字符串')
        .trim()
        .not()
        .isEmpty()
        .withMessage('新闻封面必须是存在')
        .isURL()
        .withMessage('新闻是非法的url地址'),

      details
        .isString()
        .withMessage('新闻内容必须是字符串')
        .trim()
        .not()
        .isEmpty()
        .withMessage('新闻内容不能为空'),
    ];
  }

  // 获取新闻列表
  static async getNews(req, res, next) {
    try {
      const { since = 0, counts = 30 } = req.query;
      const result = await NewsService.getNews({
        since: since,
        limit: counts,
      });
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 添加新闻
  static async createNews(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }

      const { title, cover, details } = req.body;
      const result = await NewsService.createNews({
        title,
        cover,
        // 文章内容安全过滤 危险属性和标签
        details: DOMPurify.sanitize(details),
      });
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据新闻 ID 获取新闻详情
  static async getNewsById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { id } = req.params;
      const result = await NewsService.getNewsById(id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据新闻 ID 删除新闻
  static async removeNewsById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { id } = req.params;
      const result = await NewsService.removeNewsById(id);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 根据新闻 ID 更新新闻
  static async updateNewsById(req, res, next) {
    try {
      // 得到验证结果
      const isValidator = await utils.validate(req, res);
      if (!isValidator) {
        return;
      }
      const { id } = req.params;
      const user = await NewsService.getNewsById(id);
      if (user) {
        const result = await NewsService.updateNewsById(id, req.body);
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

module.exports = NewsController;
