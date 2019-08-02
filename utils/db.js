'use strict';

const mongoose = require('mongoose');
const mongodbUrl = `${process.env.DB_URL}/${process.env.DB_DATABASE}`;

module.exports = {
  connect(opts = {}) {
    const mongodbOptions = Object.assign(
        {
          useCreateIndex: true,
          useNewUrlParser: true,
        },
        opts,
    );
    mongoose.connect(mongodbUrl, mongodbOptions, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('mongodb ok');
      }
    });
  },
};
