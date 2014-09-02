var server = require('./server');
var dataSource = server.dataSources.accountDB;
var Account = server.models.account;
var accounts = [
    { email: 'foo@bar.com',
      created: new Date(),
      modified: new Date()
    }, {
      email: 'bar@bar.com',
      created: new Date(),
      modified: new Date()
    } ];

var count = accounts.length;
dataSource.automigrate('account', function(er) {
  if (er) throw er;
  accounts.forEach(function(account) {
    Account.create(account, function(er, result) {
      if (er) return;
      console.log('Record created:', result);
      count--;
      if(count === 0) {
        console.log('done');
        dataSource.disconnect();
      }
    });
  });
});
