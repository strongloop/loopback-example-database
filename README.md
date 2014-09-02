#loopback-example-database
The purpose of this project is to demonstrate the usage of various [LoopBack](http://loopback.io) database connectors. Each branch in this repository contains a prebuilt configuration for a specific connector.

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

##Getting Started
In this example, we will demonstrate the usage of the [LoopBack Oracle Connector](https://github.com/strongloop/loopback-connector-oracle). Instead of setting up your own database instance to connect to (which you would normally do), we will be connecting to an preconfigured Oracle instance running at demo.strongloop.com.

###Prerequisites
We will need the [slc](https://github.com/strongloop/strongloop) (StrongLoop Controller) command line tool to simplify various tasks in the example.

```sh
npm install -g strongloop
```

###Create the LoopBack Application
To demonstrate how to use the [LoopBack Oracle Connector](https://github.com/strongloop/loopback-connector-oracle), let's create an application from scratch using the `slc` command. Follow the prompt and remember to name your project `loopback-example-database`. We will also add the connector to this project by using [NPM](https://www.npmjs.org/).

```sh
slc loopback #create project
cd loopback-example-database
npm install --save loopback-connector-oracle #add connector
```

Add the following to your startup file:

```
source $HOME/strong-oracle.rc
```

####Automatic PATH Modification
As a part of the installation process, you will see this message:

```
...
---------------------------------------------------------------------------
The node-oracle module and the Oracle specific libraries have been
installed in /Users/sh/repos/loopback-example-database/node_modules/loopback-connector-oracle/node_modules/loopback-oracle-installer.

The default bashrc (/etc/bashrc) or user's bash_profile (~/.bash_profile)
paths have been modified to use this path. If you use a shell other than
bash, please remember to set the DYLD_LIBRARY_PATH prior to using node.

Example:
  $ export DYLD_LIBRARY_PATH=":/Users/$USER/repos/loopback-example-database/node_modules/loopback-connector-oracle/node_modules/instantclient:/Users/$USER/repos/loopback-example-database/node_modules/loopback-connector-oracle/node_modules/instantclient"
...
```

However, this is a **deprecated** feature from LoopBack 1.x (we will remove this message in a future update). Due to concerns raised in the past regarding the "invasiveness" of automatic PATH modification, we now generate a file in your home directory named `strong-oracle.rc` instead.  This file is meant to be sourced into your startup file (.bashrc, .bash_profile, etc) **manually**.

###Add a Data Source
Run the following from the `loopback-example-database` directory to create a data source named `accountDB`:

```sh
slc loopback:datasource accountDB
```

###Configure the Data Source
By default, the auto-generated data source uses the [Memory Connector](http://docs.strongloop.com/display/LB/Memory+connector). However, since we're going to connect using Oracle, in `loopback-example-database/server/datasources.json`, modify the `accountDB` configuration to look like:

```json
{
  ...
  "accountDB": {
    "name": "accountDB",
    "connector": "oracle",
    "host": "demo.strongloop.com",
    "port": 1521,
    "database": "XE",
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
Now that we have an `account` model configured, we can generate its corresponding table and fields in the database using the API's provided by [LoopBack](http://loopback.io). Copy `create-test-data.js` from this repository and put it into `loopback-example-database/server/create-test-data.js`. Run the following in `loopback-example-database/server` to add dummy data to your database:

```sh
cd server #make sure you're in the server dir
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

`dataSource.automigrate()` creates or recreates a table in Oracle based on the model definition for `account`. This means **if the table already exists, it will be dropped and all of its existing data will be lost**. If you want to keep the existing data, use `dataSource.autoupdate()` instead.

`Account.create()` inserts two sample records to the Oracle table.

###Run the Application
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

###Discovery
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
    "oracle": {
      "schema": "DEMO",
      "table": "ACCOUNT"
    }
  },
  "properties": {
    "email": {
      "type": "String",
      "required": false,
      "length": 1024,
      "precision": null,
      "scale": null,
      "oracle": {
        "columnName": "EMAIL",
        "dataType": "VARCHAR2",
        "dataLength": 1024,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "Y"
      }
    },
    ...
  }
}
```

Following the model definition, existing `accounts` are then displayed:

```json
[ { email: 'foo@bar.com',
    created: Tue Sep 02 2014 11:48:36 GMT-0700 (PDT),
    modified: Tue Sep 02 2014 11:48:36 GMT-0700 (PDT),
    id: 1 },
  { email: 'bar@bar.com',
    created: Tue Sep 02 2014 11:48:36 GMT-0700 (PDT),
    modified: Tue Sep 02 2014 11:48:36 GMT-0700 (PDT),
    id: 2 } ]
```

####discover.js
The `dataSource.discoverSchema()` method returns the model definition based on the `account` table schema. `dataSource.discoverAndBuildModels()` goes one step further by making the model classes available to perform CRUD operations.

```javascript
dataSource.discoverSchema('ACCOUNT', { owner: 'DEMO' }, function(er, schema) {
  ...
  console.log(JSON.stringify(schema, null, '  '));
});

dataSource.discoverAndBuildModels('ACCOUNT', { owner: 'DEMO' }, function(er, models) {
  ...
  models.Account.find(function(er, accounts) {
    if (er) return console.log(er);
    console.log(accounts);
    dataSource.disconnect();
  });
});
```

##Conclusion
As you can see, the Oracle connector for LoopBack enables applications to work with data in Oracle databases. It can be newly generated data from mobile devices that need to be persisted or existing data that need to be shared between mobile clients and other backend applications. No matter where you start, [LoopBack](http://loopback.io) makes it easy to handle your data with Oracle. It’s great to have Oracle in the Loop!

##LoopBack
[LoopBack](http://docs.strongloop.com/loopback) is an open source mobile backend framework that connects mobile devices to enterprise data. It provides out-of-box data access capabilities for models through pluggable [datasources and connectors](http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide). Connectors provide connectivity to various backend systems (such as databases or REST APIs). Models are in turn exposed to mobile devices as REST APIs and SDKs. For more information, see [https://github.com/strongloop/loopback](https://github.com/strongloop/loopback).
