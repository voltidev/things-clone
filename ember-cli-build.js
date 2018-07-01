'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const postcssPlugins = require('narwin-pack');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: postcssPlugins
          }
        ]
      }
    }
  });

  return app.toTree();
};
