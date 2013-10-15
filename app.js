/*!
 * App Dependencies.
 */

require('strong-agent').profile();

var control = require('strong-cluster-control');
var options = control.loadOptions();

// If configured as a cluster master, just start controller
if(options.clustered && options.isMaster) {
  return control.start(options);
}

var fs = require('fs');
var path = require('path');

/**
 * Synchronously loads all modules within the project.
 *
 * @returns  An Object mapping module names to modules instances.
 */
function loadModules() {
  var modules = {};
  var moduleDir = path.resolve(__dirname, 'modules');

  fs
    .readdirSync(moduleDir)
    .forEach(function (fragment) {
      var fullpath = path.join(moduleDir, fragment);
      var name = fragment.slice(0, fragment.length - path.extname(fragment).length);

      modules[name] = require(fullpath);
    });

  return modules;
}

console.log('Loading mysql-example...');
loadModules();
