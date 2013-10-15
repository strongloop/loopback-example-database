/*!
 * A CRUD-capable model.
 */
var loopback = require('loopback');
var properties = require('./properties');
var config = require('./config');
var account = loopback.Model.extend('account', properties, config);

if (config['data-source']) {
  account.attachTo(require('../' + config['data-source']));
}

module.exports = account;
