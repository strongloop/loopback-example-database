##Overview

This module demonstrates using various [LoopBack](http://loopback.io) database connectors. Each branch in the repository contains a prebuilt configuration for a specific connector.

|Connector Name|Branch Name|
|--------------|-----------|
|[LoopBack Microsoft SQL Server Connector](https://github.com/strongloop/loopback-connector-mssql)|[mssql](https://github.com/strongloop/loopback-example-database/tree/mssql)|
|[LoopBack MongoDB Connector](https://github.com/strongloop/loopback-connector-mongodb)|[mongodb](https://github.com/strongloop/loopback-example-database/tree/mongodb)|
|[LoopBack MySQL Connector](https://github.com/strongloop/loopback-connector-mysql)|[master](https://github.com/strongloop/loopback-example-database/tree/master)|
|[LoopBack Oracle Connector](https://github.com/strongloop/loopback-connector-oracle)|[oracle](https://github.com/strongloop/loopback-example-database/tree/oracle)|
|[LoopBack PostgreSQL Connector](https://github.com/strongloop/loopback-connector-postgresql)|[postgresql](https://github.com/strongloop/loopback-example-database/tree/postgresql)|

For example, run the following to view the MongoDB example:

```sh
git clone https://github.com/strongloop/loopback-example-database.git
cd loopback-example-database
git checkout mongodb
```

### Example: MySQL

This example procedure below demonstrates using the [LoopBack MySQL Connector](http://docs.strongloop.com/display/LB/MySQL+connector).   Using other datbase connectors is similar.  Instead of connecting to your own database instance (which you would normally do), this example shows how to 
connect to an preconfigured MySQL instance running at demo.strongloop.com.

##Prerequisites

Before starting, make sure you've followed [Getting Started with LoopBack](http://docs.strongloop.com/display/LB/Getting+started+with+LoopBack) to install Node and LoopBack. You will also need a basic understanding  of [LoopBack models](http://docs.strongloop.com/display/LB/Working+with+models).

### Create the LoopBack application
To demonstrate how to use [LoopBack MySQL Connector](https://github.com/strongloop/loopback-connector-mysql), let's create an application from scratch using the `slc` command. Follow the prompt and remember to name your project `loopback-example-database`. We will also add the connector to this project by using [NPM](https://www.npmjs.org/).

```sh
slc loopback #create project
cd loopback-example-database
npm install --save loopback-connector-mysql #add connector
```

##Add a data source
Run the following from the `loopback-example-database` directory to create a data source named `accountDB`:

```sh
slc loopback:datasource accountDB
```

##Configure the data source
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

## Add a model
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

## Create the table and add test data
Now that we have an `account` model configured, we can generate its corresponding table and fields in the database using the API's provided by [LoopBack](http://loopback.io). Copy `create-test-data.js` from this repository and put it into `loopback-example-database/server/create-test-data.js`. Run the following in `loopback-example-database/server` to add dummy data to your database:

```sh
cd server #make sure you're in the server dir
node create-test-data
```

This script will add two accounts into your database.

###create-test-data.js
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

##Run the application
```sh
cd .. #change back to the project root, ie) loopback-example-database
node .
```

Browse to [http://localhost:3000/api/accounts](http://localhost:3000/api/accounts) to view the accounts you created in the previous step. You should see:

```json
[
  {
    "email": "foo@bar.com",
    "created": "2014-08-28T22:56:28.000Z", #yours will be different
    "modified": "2014-08-28T22:56:28.000Z", #yours will be different
    "id": 1
  },
  {
    "email": "bar@bar.com",
    "created": "2014-08-28T22:56:28.000Z", #yours will be different
    "modified": "2014-08-28T22:56:28.000Z", #yours will be different
    "id": 2
  }
]
```

To get an account by id, browse to [http://localhost:3000/api/accounts/1](http://localhost:3000/api/accounts/1).

```json
{
  "email": "foo@bar.com",
  "created": "2014-08-28T22:56:28.000Z", #yours will be different
  "modified": "2014-08-28T22:56:28.000Z", #yours will be different
  "id": 1
}
```

Each REST API can be viewed at [http://localhost:3000/explorer](http://localhost:3000/explorer)

##Discovery
Now that we have the `account` table created properly in the database, we can discover (reverse engineer) the LoopBack model from the existing database schema. Change to the `loopback-example-database/server` directory and run:

```sh
cd server #change back to the server dir
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

###discover.js
The `dataSource.discoverSchema()` method returns the model definition based on the `account` table schema. `dataSource.discoverAndBuildModels()` goes one step further by making the model classes available to perform CRUD operations.

```javascript
dataSource.discoverSchema('account', { owner: 'demo' }, function(er, schema) {
  ...
  console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('account', { owner: 'demo' }, function(er, models) {
  ...
  models.Account.find(function(er, accounts) {
    if (er) return console.log(er);
    console.log(accounts);
    dataSource.disconnect();
  });
});
```
