var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.datasources.accountDS;

var account = {
  email: 'bob.doe@ibm.com',
  createdAt: new Date(),
  lastModifiedAt: new Date(),
};
var opts = {
  idInjection: true,
};
var Account = ds.buildModelFromInstance('Account', account, opts);

var instance = new Account(account);
Account.create(instance, function(err, model) {
  if (err) throw err;

  console.log('Created:', model);

  ds.disconnect();
});
