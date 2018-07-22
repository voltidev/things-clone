module.exports = {
  root: true,

  plugins: ['ember'],

  extends: ['airbnb-base', 'plugin:ember/recommended'],

  env: {
    browser: true,
    node: false
  },

  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },

  rules: {
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': 'off',
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'comma-dangle': 'off',
    'prefer-arrow-callback': 'off',
    'func-names': 'off',
    'prefer-rest-params': 'off',
    'no-underscore-dangle': 'off',
    'array-callback-return': 'off',
    'prefer-const': 'off',
    'object-curly-newline': 'off',

    // Optional ember rules
    'ember/alias-model-in-controller': 'off',
    'ember/named-functions-in-promises': 'off',
    'ember/use-ember-get-and-set': 'off',
    'ember/avoid-leaking-state-in-components': 'off',
    'ember/no-on-calls-in-components': 'off',
    'ember/local-modules': 'error',
    'ember/no-empty-attrs': 'error',
    'ember/no-jquery': 'error',
    'ember/no-observers': 'error',
    'ember/order-in-components': 'error',
    'ember/order-in-controllers': 'error',
    'ember/order-in-models': 'error',
    'ember/order-in-routes': 'error',
    'ember/no-jquery': 'error',

    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never'
      }
    ],

    'generator-star-spacing': [
      'error',
      {
        before: false,
        after: true
      }
    ]
  },

  overrides: [
    // for Ember node files
    {
      files: ['ember-cli-build.js', 'testem.js', 'config/**/*.js', 'lib/*/index.js'],

      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },

      env: {
        browser: false,
        node: true
      }
    }
  ]
};
