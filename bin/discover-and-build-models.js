var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.accountDS;
ds.discoverAndBuildModels('Account', {schema: 'loopback-example-mysql'},
    function(err, models) {
  if (err) throw err;

  models.Account.find(function(err, accounts) {
    if (err) throw err;

    console.log('Found:', accounts);

    ds.disconnect();
  });
});
