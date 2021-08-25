const geoip = require('geoip-lite');

module.exports = class DetectService {
  constructor() {
    this.ip = '';
    this.referer = '';
    this.useragent = {};
    this.whiteListCountries = process.env.WHITE_LIST_COUNTRIES.split(' ');
  }

  checkReferer() {}

  isWhiteListCountry() {
    console.log(this.getCountry(), 'Remote country');
    console.log(this.whiteListCountries, 'White list');

    return this.whiteListCountries.includes(this.getCountry());
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

  isWhite() {
    return !this.isWhiteListCountry();
  }

  redirectFlow(req, res, next) {
    this.ip = req.connection.remoteAddress;
    this.referer = req.get('Referrer');
    this.useragent = req.useragent;

    console.log('Referer:', this.referer);
    console.log('UserAgent:', this.useragent);

    const isWhite = this.isWhite();
    console.log('Redirect to white?:', isWhite);

    isWhite ? (req.url = `/white/${req.url}`) : (req.url = `/black/${req.url}`);

    next();
  }
};
