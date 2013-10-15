/*!
 * An in-memory DataSource for development.
 */
var loopback = require('loopback');

module.exports = loopback.createDataSource({
  connector: require('loopback-connector-mysql'),
  host: 'demo.strongloop.com',
  port: 3306,
  database: 'demo',
  username: 'demo',
  password: 'L00pBack'
});
