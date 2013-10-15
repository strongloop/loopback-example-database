loopback-mysql-example
======================

LoopBack MySQL example

## Create the LoopBack application

    $ slc lb project loopback-mysql-example
    $ cd loopback-mysql-example
    $ slc lb model account -i

## Install loopback-connector-mysql

    $ slc install strongloop/loopback-connector-mysql --save
    $ slc install

## Configure the data source

    $ cd modules/db
    $ vi index.js

    module.exports = loopback.createDataSource({
      connector: require('loopback-connector-mysql'),
      host: 'demo.strongloop.com',
      port: 3306,
      database: 'demo',
      username: 'demo',
      password: 'L00pBack'
    });
    
