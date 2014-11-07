/**
 * Async boot script to run model discovery
 *
 * NOTE: Due to the order of execution for boot scripts, we name the script
 * as `discover.js` so that it will be run before rest-api and explorer
 * 
 * @param {Object} server The server side app instance
 * @param {Function} cb The callback function
 *
 */
module.exports = function(server, cb) {
  var ds = server.dataSources.accountDB;
  ds.discoverAndBuildModels('car', {
      schema: 'public',
      base: 'PersistedModel' // Make sure discovered models extend from PersistedModel
    },
    function(err, models) {
      if (err) {
        return cb(err);
      }
      for (var m in models) {
        var model = models[m];
        model.setup(); // Set up remoting
        server.model(model); // Register the model with app
      }
      console.log('Model discovered: ', Object.keys(models));
      return cb();
    });
};
