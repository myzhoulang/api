'use strict';

const mongoose = require('mongoose');
const mongodbUrl = `${process.env.DB_URL}/${process.env.DB_DATABASE}`;

module.exports = {
  connect(opts = {}) {
    const mongodbOptions = Object.assign(
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
      },
      opts,
    );
    mongoose
      .connect(mongodbUrl, mongodbOptions)
      .then(r => console.log('mongodb ok'))
      .catch(e => console.log(e));
  },
};
