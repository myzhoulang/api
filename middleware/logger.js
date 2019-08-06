'use strict';

const fs = require('fs');
const path = require('path');
const morgan = require('morgan');
const FileStreamRotator = require('file-stream-rotator');
const logDirectory = path.join(__dirname, '../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const successLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'success-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
});

const failLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'fail-%DATE%.log'),
  frequency: 'daily',
  verbose: false,
});

// 自定义记录字段
morgan.token('query', req => {
  return `query => ${JSON.stringify(req.query)} -`;
});
morgan.token('body', req => {
  return `body => ${JSON.stringify(req.body)} -`;
});
morgan.token('params', req => {
  return `params => ${JSON.stringify(req.params)} -`;
});

// 需要日志记录字段
const successLog =
  '[:date[iso]] :method :url :status :query :params :body - :response-time ms';
const failLog =
  '[:date[iso]] :method :url :status :query :params :body - :response-time ms';

// 成功
const successLogger = morgan(successLog, {
  stream: successLogStream,
  skip: function(req, res) {
    return res.statusCode > 200;
  },
});

// 成功
const failLogger = morgan(failLog, {
  stream: failLogStream,
  skip: function(req, res) {
    return res.statusCode < 300;
  },
});

module.exports = {
  successLogger,
  failLogger,
};
