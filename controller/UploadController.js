'use strict';

const multer = require('multer');
const path = require('path');
const client = require('../utils/oss');
const storage = multer.memoryStorage();

// 检查文件类型
function checkFileType(file, cb) {
  // 可以上传的图片类型
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // 检查上传上来的图片后缀名
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // 检查 mime 类型
  const mimetype = filetypes.test(file.mimetype);
  // 判断是否文件可上传
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb({
      status: 422,
      message: `只能上传指定的图片格式(${filetypes})`,
    });
  }
}
// 文件上传配置
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  },
}).single('file');

class UploadController {
  static async upload(req, res, next) {
    upload(req, res, async error => {
      if (error) {
        next(error);
      } else {
        if (!req.file) {
          res.status(422).json({
            message: '至少需要一个文件',
          });
        } else {
          try {
            const file = req.file;
            const ext = path.extname(file.originalname);
            const fileName = file.fieldname + '_' + Date.now() + ext;
            await client.put('website/' + fileName, req.file.buffer);
            const url = client.signatureUrl('website/' + fileName, {
              expires: 380000,
            });
            res.status(200).json({
              url: url,
            });
          } catch (error) {
            next(error);
          }
        }
      }
    });
  }
}

module.exports = UploadController;
