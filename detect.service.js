const geoip = require('geoip-lite');

module.exports = class DetectService {
  static isWhiteCountry(ip) {
    console.log(DetectService.getCountry(ip), 'Remote country');
    console.log(process.env.WHITE_LIST_COUNTRIES, 'White list');

    return DetectService.getCountry(ip) === process.env.WHITE_LIST_COUNTRIES;
  }

  static isWhite(ip) {
    return DetectService.isWhiteCountry(ip);
  }

  static getCountry(ip) {
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

    return lookedUpIP.country;
  }

  static redirectFlow(req, res, next) {
    const ip = req.connection.remoteAddress;
    const isWhite = DetectService.isWhite(ip);

    console.log(isWhite);

    isWhite ? (req.url = `/white/${req.url}`) : (req.url = `/black/${req.url}`);

    next();
  }
};
