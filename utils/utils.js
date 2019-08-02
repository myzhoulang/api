module.exports = {
  error(status = 500, message = 'Internal Server Error') {
    return {
      status,
      message,
    };
  },
  success(status = 200, data) {
    return {
      status,
      data,
    };
  },
};
