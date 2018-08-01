import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import config from 'things/config/environment';
import Resolver from './resolver';

// Disable velocity during testing
// velocity.mock = config.isTest;

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});

loadInitializers(App, config.modulePrefix);

export default App;
