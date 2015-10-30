var app = require('../server/server');
var chai = require('chai');

app.start();
app.once('started', function() {
  global.app = app;
});

global.expect = chai.expect;
