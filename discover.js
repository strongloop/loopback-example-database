var app = require('./app');
var dataSource = app.dataSources.accountDB;

dataSource.discoverSchema('ACCOUNT', {owner: 'DEMO'}, function (err, schema) {
  console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('ACCOUNT', {owner: 'DEMO'}, function (err, models) {
  if (err) {
    console.error(err);
    return;
  }
  models.Account.find(function (err, act) {
    if (err) {
      console.error(err);
    } else {
      console.log(act);
    }
    app.stop();
  });
});

