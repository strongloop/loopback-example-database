module.exports = function(server, done) {
  var ds = server.dataSources.accountDB;
  // Discover the demo.car
  // Set the base to be PersistedModel
  ds.discoverAndBuildModels('car', { owner: 'demo', base: 'PersistedModel' },
    function(err, models) {
    var Car = models.Car;
    // Set up remoting
    Car.setup();
    // Expose it to REST
    server.model(Car);
    done();
  });
};

// Set order to 1 so that it will be invoked before default scripts (order=100)
module.exports.order = 1;
