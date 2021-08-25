const geoip = require('geoip-lite');

module.exports = class DetectService {
  static isWhite() {
    return false;
  }

  static getIpInfo(ip) {
    if (ip.includes('::ffff:')) {
      ip = ip.split(':').reverse()[0];
    }

    const lookedUpIP = geoip.lookup(ip);
    if (ip === '127.0.0.1' || ip === '::1') {
      return { error: "This won't work on localhost" };
    }

    if (!lookedUpIP) {
      return { error: 'Error occured while trying to process the information' };
    }

    return lookedUpIP;
  }

  static redirectFlow(req, res, next) {
    console.log(DetectService.getIpInfo(req.connection.remoteAddress));
    if (DetectService.isWhite()) {
      req.url = `/white/${req.url}`;
    } else {
      req.url = `/black/${req.url}`;
    }

    next();
  }
};
