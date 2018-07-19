'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const postcssPlugins = require('narwin-pack');
const postcssFunctions = require('postcss-functions');

function pixelsToUnit(pixels, unit, context = '16px') {
  return `${parseInt(pixels, 10) / parseInt(context, 10)}${unit}`;
}

const postcssUnitsFunctions = {
  em: (pixels, context) => pixelsToUnit(pixels, 'em', context),
  rem: (pixels, context) => pixelsToUnit(pixels, 'rem', context)
};

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    // TODO: `ember-sortable` is the only reason why we still have to include jQuery.
    // Uncomment as soon as you find an alternative to `ember-sortable`.
    // vendorFiles: { 'jquery.js': null },

    postcssOptions: {
      compile: {
        plugins: [
          { module: postcssPlugins },
          {
            module: postcssFunctions,
            options: { functions: postcssUnitsFunctions }
          }
        ]
      }
    },

    stylelint: {
      linterConfig: {
        syntax: 'css'
      }
    }
  });

  return app.toTree();
};
