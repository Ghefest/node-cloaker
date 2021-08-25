const geoip = require('geoip-lite');

module.exports = class DetectService {
  constructor() {
    this.ip = '';
  }

  isWhiteCountry() {
    console.log(this.getCountry(), 'Remote country');
    console.log(process.env.WHITE_LIST_COUNTRIES, 'White list');

    return this.getCountry() === process.env.WHITE_LIST_COUNTRIES;
  }

  isWhite() {
    return this.isWhiteCountry();
  }

  getCountry() {
    if (this.ip.includes('::ffff:')) {
      this.ip = this.ip.split(':').reverse()[0];
    }

    const lookedUpIP = geoip.lookup(this.ip);

    if (this.ip === '127.0.0.1' || this.ip === '::1') {
      return { error: "This won't work on localhost" };
    }

    if (!lookedUpIP) {
      return { error: 'Error occured while trying to process the information' };
    }

    return lookedUpIP.country;
  }

  redirectFlow(req, res, next) {
    this.ip = req.connection.remoteAddress;

    const isWhite = this.isWhite();
    console.log(isWhite);

    isWhite ? (req.url = `/white/${req.url}`) : (req.url = `/black/${req.url}`);

    next();
  }
};
