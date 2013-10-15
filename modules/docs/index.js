/*!
 * Adds dynamically-updated docs as /explorer
 */
var path = require('path');
var loopback = require('loopback');
var config = require('./config');
var STATIC_ROOT = path.join(__dirname, 'explorer');
var applications = config.applications || [];
var explorerUrl = config.url || '/explorer';

process.nextTick(function () {
  applications.forEach(function (name) {
    var app = require('../' + name);

    app.docs({ basePath: '/' });
    app.get(explorerUrl, function (req, res, next) {
      if (!/\/$/.test(req.url)) {
        res.redirect(req.url + '/');
      } else {
        next();
      }
    });
    app.use(explorerUrl, loopback.static(STATIC_ROOT));
  });
});

module.exports = {};
