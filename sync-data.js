var app = require('./app');
var async = require('async');

// First data source - oracle
var dataSource = app.dataSources.accountDB;

// Second data source - mongodb
var dataSource2 = app.dataSources.account2DB;

// Oracle account
var Account = app.models.account;

// MongoDB account
var Account2 = app.models.account2;

// Dummy data
var accounts = [
  { email: "foo@bar.com",
    level: 10,
    created: new Date(),
    modified: new Date()
  },
  {
    email: "bar@bar.com",
    level: 20,
    created: new Date(),
    modified: new Date()
  }
];

console.log('Synchronization is now started.');
async.series([
  function (cb) {
    console.log('1. Auto-migrating accounts for DB1');
    dataSource.automigrate('account', cb);
  },
  function (cb) {
    console.log('2. Removing accounts from DB2');
    Account2.destroyAll(cb);
  },
  function (cb) {
    console.log('3. Creating accounts in DB1');
    async.each(accounts, Account.create.bind(Account), cb);
  },
  function (cb) {
    console.log('4. Finding accounts from DB1');
    Account.find(function (err, accounts) {
      if (err) {
        return cb(err);
      }
      console.log('Accounts found from DB1: ', accounts);
      console.log('5. Creating accounts in DB2');
      async.each(accounts, Account2.create.bind(Account2), cb);
    });
  },
  function (cb) {
    console.log('6. Finding accounts from DB2');
    Account2.find(function (err, accounts) {
      if (err) {
        return cb(err);
      }
      console.log('Accounts found from DB2: ', accounts);
      cb();
    });
  }
], function (err, results) {
  if (err) {
    console.error(err);
  }
  console.log('Synchronization is completed.');
  app.stop();
});

