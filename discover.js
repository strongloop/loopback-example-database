var app = require('./app');
var dataSource = app.dataSources.mysql;

dataSource.discoverSchema('account', {owner: 'demo'}, function (err, schema) {
  console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('account', {owner: 'demo'}, function (err, models) {
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

