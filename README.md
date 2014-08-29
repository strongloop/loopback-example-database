#loopback-example-database
The purpose of this project is to demonstrate the usage of various [LoopBack](http://loopback.io) database connectors. Each branch in this repository contains a prebuilt configuration for a specific connector.

|Connector Name|Branch Name|
|--------------|-----------|
|[LoopBack Microsoft SQL Server Connector](https://github.com/strongloop/loopback-connector-mssql)|[mssql](https://github.com/strongloop-community/loopback-example-database/tree/mssql)|
|[LoopBack MongoDB Connector](https://github.com/strongloop/loopback-connector-mongodb)|[mongodb](https://github.com/strongloop-community/loopback-example-database/tree/mongodb)|
|[LoopBack MySQL Connector](https://github.com/strongloop/loopback-connector-mysql)|[master](https://github.com/strongloop-community/loopback-example-database/tree/master)|
|[LoopBack Oracle Connector](https://github.com/strongloop/loopback-connector-oracle)|[oracle](https://github.com/strongloop-community/loopback-example-database/tree/oracle)|
|[LoopBack PostgreSQL Connector](https://github.com/strongloop/loopback-connector-postgresql)|[postgresql](https://github.com/strongloop-community/loopback-example-database/tree/postgresql)|

For example, run the following to view the MongoDB example:

```sh
git clone https://github.com/strongloop-community/loopback-example-database.git
cd loopback-example-database
git checkout mongodb
```

##Getting Started
In this example, we will demonstrate the usage of the [LoopBack MySQL Connector](https://github.com/strongloop/loopback-connector-mysql). Instead of setting up your own database instance to connect to (which you would normally do), we will be connecting to an preconfigured MySQL instance running at demo.strongloop.com.

###Prerequisites
We will need the [slc](https://github.com/strongloop/strongloop) (StrongLoop Controller) command line tool to simplify various tasks in the example.

```sh
npm install -g strongloop
```

###Create the LoopBack Application
To demonstrate how to use [LoopBack MySQL Connector](https://github.com/strongloop/loopback-connector-mysql), let's create an application from scratch using the `slc` command. Follow the prompt and remember to name your project `loopback-example-database`. We will also add the connector to this project by using [NPM](https://www.npmjs.org/).

```sh
slc loopback #create project
cd loopback-example-database
npm install --save loopback-connector-mysql #add connector
```

###Add a Data Source
To create a datasource named `accountDB`, run:

```sh
cd loopback-example-database
slc loopback:datasource accountDB
```

###Configure the Data Source
By default, the auto-generated data source uses the [Memory Connector](http://docs.strongloop.com/display/LB/Memory+connector). However, since we're going to connect using MySQL, in `loopback-example-database/server/datasources.json`, modify the `accountDB` configuration to look like:

```json
{
  ...
  "accountDB": {
    "name": "accountDB",
    "connector": "mysql",
    "host": "demo.strongloop.com",
    "port": 3306,
    "database": "demo",
    "username": "demo",
    "password": "L00pBack"
  }
}
```

###Add a Model
Once we have the data source configured properly, we can create an account model by running:

```sh
slc loopback:model account
```

Follow the prompts to create your model with the following properties:

|Property|Data Type|Description|
|--------|---------|-----------|
|email|string|The email id for the account|
|created|date|The time of creation for the account|
|modified|date|The last modification time for the account|

These properties will be saved to `loopback-example-database/common/models/account.json` once the prompt exits.

###Create the Table and Add Test Data
Now that we have an `account` model configured, we can generate its corresponding table and fields in the database using the API's provided by [LoopBack](http://loopback.io). Copy `create-test-data.js` from this repository and put it into `loopback-example-database/server/create-test-data.js`. Run the following to add dummy data to your database:

```sh
cd loopback-example-database/server #make sure you're in the server dir
node create-test-data
```

This script will add two accounts into your database.

####create-test-data.js
```javascript
dataSource.automigrate('account', function(er) {
  ...
  accounts.forEach(function(account) {
    Account.create(account, function(er, result) {
      if (!er) return;
      console.log('Record created:', result);
      ...
    });
  });
});
```

`dataSource.automigrate()` creates or recreates a table in MySQL based on the model definition for `account`. This means **if the table already exists, it will be dropped and all of its existing data will be lost**. If you want to keep the existing data, use `dataSource.autoupdate()` instead.

`Account.create()` inserts two sample records to the MySQL table.

###Run the application
```sh
cd loopback-example-database
node .
```

Browse to [http://localhost:3000/api/accounts](http://localhost:3000/api/accounts) to view the accounts you created in the previous step. You should see:

```json
[
  {
    "email": "foo@bar.com",
    "created": "2014-08-28T22:56:28.000Z", #your date/time will differ
    "modified": "2014-08-28T22:56:28.000Z", #yours date/time will differ
    "id": 1
  },
  {
    "email": "bar@bar.com",
    "created": "2014-08-28T22:56:28.000Z", #your date/time will differ
    "modified": "2014-08-28T22:56:28.000Z", #your date/time will differ
    "id": 2
  }
]
```

To get an account by id, browse to [http://localhost:3000/api/accounts/1](http://localhost:3000/api/accounts/1).

```json
    {
      "email": "foo@bar.com",
      "level": 10,
      "created": "2013-10-15T21:34:50.000Z",
      "modified": "2013-10-15T21:34:50.000Z",
      "id": "1"
    }
```

Each REST API can be viewed at [http://localhost:3000/explorer](http://localhost:3000/explorer)

###Discovery
Now that we have the `account` table created properly in the database, we can discover (reverse engineer) the LoopBack model from the existing database schema. Change to the `loopback-example-database/server` directory and run:

```sh
node discover
```

First, we'll see the model definition for `account` in JSON format.

```json
{
  "name": "Account",
  "options": {
    "idInjection": false,
    "mysql": {
      "schema": "demo",
      "table": "account"
    }
  },
  "properties": {
    "id": {
      "type": "Number",
      "required": false,
      "length": null,
      "precision": 10,
      "scale": 0,
      "id": 1,
      "mysql": {
        "columnName": "id",
        "dataType": "int",
        "dataLength": null,
        "dataPrecision": 10,
        "dataScale": 0,
        "nullable": "NO"
      }
    },
    "email": {
      "type": "String",
      "required": false,
      "length": 1536,
      "precision": null,
      "scale": null,
      "mysql": {
        "columnName": "email",
        "dataType": "varchar",
        "dataLength": 1536,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    },
    ...
  }
}
```

Following the model definition, existing `accounts` are then displayed:

```json
[ { id: 1,
    email: 'foo@bar.com',
    created: Thu Aug 28 2014 15:56:28 GMT-0700 (PDT),
    modified: Thu Aug 28 2014 15:56:28 GMT-0700 (PDT) },
  { id: 2,
    email: 'bar@bar.com',
    created: Thu Aug 28 2014 15:56:28 GMT-0700 (PDT),
    modified: Thu Aug 28 2014 15:56:28 GMT-0700 (PDT) } ]
```

####discover.js
The `dataSource.discoverSchema()` method returns the model definition based on the `account` table schema. `dataSource.discoverAndBuildModels()` goes one step further by making the model classes available to perform CRUD operations.

```javascript
dataSource.discoverSchema('account', { owner: 'demo' }, function(err, schema) {
  console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('account', { owner: 'demo' }, function(err, models) {
  models.Account.find(function(er, accounts) {
    if (er) return console.log(er);
    console.log(accounts);
    dataSource.disconnect();
  });
});
```

##Conclusion
As you can see, the MySQL connector for LoopBack enables applications to work with data in MySQL databases. It can be newly generated data from mobile devices that need to be persisted or existing data that need to be shared between mobile clients and other backend applications. No matter where you start, [LoopBack](http://loopback.io) makes it easy to handle your data with MySQL. It’s great to have MySQL in the Loop!

##LoopBack
[LoopBack](http://docs.strongloop.com/loopback) is an open source mobile backend framework that connects mobile devices to enterprise data. It provides out-of-box data access capabilities for models through pluggable [datasources and connectors](http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide). Connectors provide connectivity to various backend systems (such as databases or REST APIs). Models are in turn exposed to mobile devices as REST APIs and SDKs. For more information, see [https://github.com/strongloop/loopback](https://github.com/strongloop/loopback).
