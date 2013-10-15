/*!
 * The Application module is responsible for attaching other modules to an Loopback application.
 */
var loopback = require('loopback');
var config = require('./config');
var app = loopback();
var middleware = config.middleware || [];
var models = config.models || [];
var started = new Date();

/**
 * Attach any middleware to the Application.
 */

middleware.forEach(function (name) {
  var fn = loopback[name];

  if (typeof fn === 'function') {
    app.use(fn.call(loopback));
  } else {
    console.error('Invalid middleware: %s', name);
  }
});

/**
 * Attach any models to the Application.
 */

models.forEach(function (name) {
  var model;

  try {
    model = require('../' + name)
  } catch(e) {
    if(e.code === 'MODULE_NOT_FOUND') {
      console.error('Cannot find model: %s', name);
    } else {
      throw e;
    }
  }

  if (typeof model === 'function') {
    app.model(model);
  } else {
    console.error('Invalid model: %s', name);
  }
});

/**
 * Start the server.
 */
var port = process.env.PORT || config.port || 3000;
var hostname = process.env.HOSTNAME || process.env.HOST || process.env.IP || config.hostname || '0.0.0.0';
var server = app.listen(port, hostname, function (err) {
  if (err) {
    console.error('Failed to start mysql-example.');
    console.error(err.stack || err.message || err);
    process.exit(1);
  }

  var info = server.address();
  var base = 'http://' + info.address + ':' + info.port;

  console.log('mysql-example running at %s.', base);
  console.log('To see the available routes, open %s/routes', base);
});

/**
 * Provide a basic status report as `GET /`.
 */
app.get('/', function getStatus(req, res, next) {
  res.send({
    started: started,
    uptime: (Date.now() - Number(started)) / 1000
  });
});

/*!
 * Export `app` for use in other modules.
 */
module.exports = app;
