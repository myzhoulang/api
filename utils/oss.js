'use strict';
const OSS = require('ali-oss');
const client = new OSS({
  endpoint: process.env.OSS_ENDPOINT,
  accessKeyId: process.env.OSS_ACCESSKEYID,
  accessKeySecret: process.env.OSS_ACCESSKEYSECRET,
  bucket: process.env.OSS_BUCKET,
});

module.exports = client;
