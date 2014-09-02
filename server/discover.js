var server = require('./server');
var dataSource = server.dataSources.accountDB;

dataSource.discoverSchema('ACCOUNT', { owner: 'DEMO' }, function(er, schema) {
  if (er) throw er;
  console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('ACCOUNT', { owner: 'DEMO' },
    function(er, models) {
  if (er) throw er;
  models.Account.find(function(er, accounts) {
    if (er) return console.log(er);
    console.log(accounts);
    dataSource.disconnect();
  });
});
