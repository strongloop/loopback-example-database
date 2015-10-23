var path = require('path');

var app = require(path.resolve(__dirname, '../server/server'));
var ds = app.dataSources.accountDS;
var q = 'USE AdventureWorks2012;\r\nEXEC dbo.uspGetEmployeeManagers 50;\r\n';
ds.connector.execute(q, [], console.log);
