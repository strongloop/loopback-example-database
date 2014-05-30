# loopback-example-database

This project contains examples to demonstrate LoopBack connectors for databases:

- [LoopBack MySQL connector](https://github.com/strongloop/loopback-connector-mysql)
- [LoopBack MongoDB connector](https://github.com/strongloop/loopback-connector-mongodb)
- [LoopBack Oracle connector](https://github.com/strongloop/loopback-connector-oracle)
- [LoopBack PostgreSQL connector](https://github.com/strongloop/loopback-connector-postgresql)
- [LoopBack Microsoft SQL Server connector](https://github.com/strongloop/loopback-connector-mssql)

You can pretty much switch between the databases by updating datasources.json and models.json.
No code change is required. In the following steps, we'll use mysql as the example.

This repository has multiple branches. Each of them contains the prebuilt 
configuration and code for the corresponding database which models are attached to.

- [master](https://github.com/strongloop-community/loopback-example-database/tree/master) - MySQL
- [mongodb](https://github.com/strongloop-community/loopback-example-database/tree/mongodb) - MongoDB
- [mssql](https://github.com/strongloop-community/loopback-example-database/tree/mssql) - Microsoft SQL Server
- [oracle](https://github.com/strongloop-community/loopback-example-database/tree/oracle) - Oracle
- [postgresql](https://github.com/strongloop-community/loopback-example-database/tree/postgresql) - PostgreSQL

To check out the project from github and switch to the mongodb branch,

```sh
git clone https://github.com/strongloop-community/loopback-example-database.git
cd loopback-example-database
git checkout mongodb
```

For those who are not familiar with [LoopBack](http://docs.strongloop.com/loopback), it’s an open source mobile backend
framework that connects mobile devices to enterprise data. LoopBack provides out-of-box data access capabilities for
models through pluggable [datasources and connectors](http://docs.strongloop.com/loopback-datasource-juggler/#loopback-datasource-and-connector-guide).
Connectors provide connectivity to variable backend systems, such as databases or REST APIs. Models are in turn exposed
to mobile devices as REST APIs and SDKs.

## Prerequisite

First, make sure you have strong-cli installed.

```sh
    npm install -g strong-cli
```

Next, you need a running MySQL server. In this article, you'll connect to an instance running on demo.strongloop.com.

## Create the LoopBack application

To demonstrate how to use MySQL connector for LoopBack, we'll create a simple application from scratch using the `slc`
command:

```sh
    slc lb project loopback-mysql-example
    cd loopback-mysql-example
    slc lb datasource accountDB --connector mysql
    slc lb model account -i --data-source accountDB
```

Follow the prompts to create your model with the following properties:

- email: string - The email id for the account
- level: number - The game level you are in
- created: date - The date your account is created
- modified: date - The date your account is updated

The properties will be saved to models.json.  


## Install dependencies

Let's add the `loopback-connector-mysql` module and install the dependencies.

```sh
    npm install loopback-connector-mysql --save
```

## Configure the data source

The generated data source use the memory connector by default, to connect to MySQL, we'll modify the data source
configuration as follows.

```sh
    vi datasources.json
```

**Note: Future releases will probably generate a config.json file for the data source configuration.**

In datasoures.json, replace the data source configuration for mysql with the following snippet:

```javascript
    "accountDB": {
    "connector": "mysql",
    "host": "demo.strongloop.com",
    "port": 3306,
    "database": "demo",
    "username": "demo",
    "password": "L00pBack"
  }
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

To get all accounts, go to http://localhost:3000/api/accounts.

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

To get an account by id, go to http://localhost:3000/api/accounts/1.

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
    ...
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

As you have seen, the MySQL connector for LoopBack enables applications to work with data in MySQL databases. 
It can be new data generated by mobile devices that need to be persisted, or existing data that need to be shared
between mobile clients and other backend applications.  No matter where you start, LoopBack makes it easy to handle 
your data with MySQL. It’s great to have MySQL in the Loop!
