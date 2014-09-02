var server = require('./server');
var async = require('async');

// First data source - oracle
var dataSource = server.dataSources.accountDB;

// Oracle account
var Account = server.models.account;

// MongoDB account
var Account2 = server.models.account2;

// Dummy data
var accounts = [
  {
    email: 'foo@bar.com',
    created: new Date(),
    modified: new Date()
  },
  {
    email: 'bar@bar.com',
    created: new Date(),
    modified: new Date()
  }
];

console.log('Synchronization is now started.');
async.series([
  function(cb) {
    console.log('1. Auto-migrating accounts for DB1');
    dataSource.automigrate('account', cb);
  },
  function(cb) {
    console.log('2. Removing accounts from DB2');
    Account2.destroyAll(cb);
  },
  function(cb) {
    console.log('3. Creating accounts in DB1');
    async.each(accounts, Account.create.bind(Account), cb);
  },
  function(cb) {
    console.log('4. Finding accounts from DB1');
    Account.find(function (er, accounts) {
      if (er) return cb(er);
      console.log('Accounts found from DB1: ', accounts);
      console.log('5. Creating accounts in DB2');
      async.each(accounts, Account2.create.bind(Account2), cb);
    });
  },
  function (cb) {
    console.log('6. Finding accounts from DB2');
    Account2.find(function (er, accounts) {
      if (er) return cb(er);
      console.log('Accounts found from DB2: ', accounts);
      cb();
    });
  }
], function(er) {
  if (er) return console.log(er);
  console.log('Synchronization is completed.');
  server.stop();
});
