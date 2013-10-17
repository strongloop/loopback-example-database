# loopback-mysql-example

This project contains examples to demonstrate [LoopBack MySQL connector](https://github.com/strongloop/loopback-connector-mysql).
The MySQL connector module allows LoopBack applications to interact with MySQL databases for the data models, such as
Account and Catalog.

For those who are not familiar with [LoopBack](http://docs.strongloop.com/loopback), it’s an open source mobile backend
framework that connects mobile devices to enterprise data. LoopBack provides out-of-box data access capabilities for
models through pluggable [datasources and connectors](http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide).
Connectors provide connectivity to variable backend systems, such as databases or REST APIs. Models are in turn exposed
to mobile devices as REST APIs and SDKs.

## Prerequisite

First of all, we need to have a MySQL server running. In this article, we'll connect to an instance running on demo.strongloop.com.

To create a LoopBack application from command-line tools, please install [StrongLoop Suite 1.0](http://strongloop.com/strongloop-suite/downloads/).

## Create the LoopBack application

To demonstrate how to use MySQL connector for LoopBack, we'll create a simple application from scratch using the `slc`
command:

```sh
    slc lb project loopback-mysql-example
    cd loopback-mysql-example
    slc lb model account -i
```

## Install dependencies

Let's add the `loopback-connector-mysql` module and install the dependencies.

```sh
    slc install strongloop/loopback-connector-mysql --save
    slc install
```

## Configure the data source

The generated data source use the memory connector by default, to connect to MySQL, we'll modify the data source
configuration as follows.

```sh
    cd modules/db
    vi index.js
```

**Note: Future releases will probably generate a config.json file for the data source configuration.**

In index.js, replace the data source configuration with the following snippet:

```javascript
    module.exports = loopback.createDataSource({
      connector: require('loopback-connector-mysql'),
      host: 'demo.strongloop.com',
      port: 3306,
      database: 'demo',
      username: 'demo',
      password: 'L00pBack'
    });
```

## Create the table and add test data

Now we have an `account` model in LoopBack, do we need to run some SQL statements to create the corresponding table in
MySQL database?

Sure, but even simpler, LoopBack provides Node.js APIs to do so automatically. The code is `create-test-data.js`.

```sh
    node create-test-data
```

Let's look at the code:

```javascript
    dataSource.automigrate('account', function (err) {
      accounts.forEach(function(act) {
        Account.create(act, function(err, result) {
          if(!err) {
            console.log('Record created:', result);
          }
        });
      });
    });
```

`dataSource.automigrate()` creates or recreates the table in MySQL based on the model definition for `account`. Please
note **the call will drop the table if it exists and your data will be lost**. We can use `dataSource.autoupdate()` instead
to keep the existing data.

`Account.create()` inserts two sample records to the MySQL table.

   
## Run the application

```sh
    node app
```

Open your browser now.

To get all accounts, go to http://localhost:3000/accounts.

```json
    [
      {
        "email": "foo@bar.com",
        "level": 10,
        "created": "2013-10-15T21:34:50.000Z",
        "modified": "2013-10-15T21:34:50.000Z",
        "id": 1
      },
      {
        "email": "bar@bar.com",
        "level": 20,
        "created": "2013-10-15T21:34:50.000Z",
        "modified": "2013-10-15T21:34:50.000Z",
        "id": 2
      }
    ]
```

To get an account by id, go to http://localhost:3000/accounts/1.

```json
    {
      "email": "foo@bar.com",
      "level": 10,
      "created": "2013-10-15T21:34:50.000Z",
      "modified": "2013-10-15T21:34:50.000Z",
      "id": "1"
    }
```

All the REST APIs can be explored at:

    http://127.0.0.1:3000/explorer

 
## Try the discovery

Now we have the `account` table existing in MySQL, we can try to discover the LoopBack model from the database. Let's
run the following example:

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
      "length": 765,
      "precision": null,
      "scale": null,
      "mysql": {
        "columnName": "email",
        "dataType": "varchar",
        "dataLength": 765,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    },
    "level": {
      "type": "Number",
      "required": false,
      "length": null,
      "precision": 10,
      "scale": 0,
      "mysql": {
        "columnName": "level",
        "dataType": "int",
        "dataLength": null,
        "dataPrecision": 10,
        "dataScale": 0,
        "nullable": "YES"
      }
    },
    "created": {
      "type": "Date",
      "required": false,
      "length": null,
      "precision": null,
      "scale": null,
      "mysql": {
        "columnName": "created",
        "dataType": "datetime",
        "dataLength": null,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    },
    "modified": {
      "type": "Date",
      "required": false,
      "length": null,
      "precision": null,
      "scale": null,
      "mysql": {
        "columnName": "modified",
        "dataType": "datetime",
        "dataLength": null,
        "dataPrecision": null,
        "dataScale": null,
        "nullable": "YES"
      }
    }
  }
}
```

Then we use the model to find all accounts from MySQL:

```json
[ { id: 1,
    email: 'foo@bar.com',
    level: 10,
    created: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT),
    modified: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT) },
  { id: 2,
    email: 'bar@bar.com',
    level: 20,
    created: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT),
    modified: Tue Oct 15 2013 14:34:50 GMT-0700 (PDT) } ]
```

Let's examine the code in discover.js too. It's surprisingly simple! The `dataSource.discoverSchema()` method returns the
model definition based on the `account` table schema. `dataSource.discoverAndBuildModels()` goes one step further by making
the model classes available to perform CRUD operations.

```javascript
    dataSource.discoverSchema('account', {owner: 'demo'}, function (err, schema) {
        console.log(JSON.stringify(schema, null, '  '));
    });

    dataSource.discoverAndBuildModels('account', {}, function (err, models) {
        models.Account.find(function (err, act) {
            if (err) {
                console.error(err);
            } else {
                console.log(act);
            }
        });
    });
```