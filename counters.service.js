const memory = require('./memory');

module.exports = class CountersService {
  constructor() {
    this.ip = '';
  }

  countFlow(req, res, next) {
    this.ip = req.connection.remoteAddress;
    memory.add(this.ip);

    console.log('Total unique users:', memory.size, '\n');

    next();
  }
};
