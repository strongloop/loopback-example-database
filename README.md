loopback-mysql-example
======================

LoopBack MySQL example

## Create the LoopBack application

```sh
    slc lb project loopback-mysql-example
    cd loopback-mysql-example
    slc lb model account -i
```

## Install loopback-connector-mysql

```sh
    slc install strongloop/loopback-connector-mysql --save
    slc install
```

## Configure the data source

```sh
    cd modules/db
    vi index.js
```

Replace the data source configuration with the following snippet:

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

## Create some test data

```sh
    node create-test-data
```

## Try the discovery

```sh
    node discover
```
   
## Run the application

```sh
    node app
```

Open your browser and point to:

    http://127.0.0.1:3000/explorer

 
