'use strict';

const { validationResult } = require('express-validator');
const { body, param } = require('express-validator/check');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const NewsService = require('../service/NewsService');
const utils = require('../utils/utils');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

class NewsController {
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

  static async searchNews(req, res, next) {
    try {
      const result = await NewsService.getNews(req.query);
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 获取用户列表
  static async getNews(req, res, next) {
    try {
      const result = await NewsService.getNews();
      const { status = 200 } = result;
      res.status(status).send(utils.makeResult(result));
    } catch (error) {
      next(error);
    }
  }

  // 新建用户
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

  // 根据用户 ID 获取用户信息
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

  // 根据用户 ID 删除用户
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
