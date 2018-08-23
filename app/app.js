import Application from '@ember/application';
import loadInitializers from 'ember-load-initializers';
import config from 'things/config/environment';
import Resolver from './resolver';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  customEvents: Object.freeze({
    selectitem: 'onSelectItem',
    selectonlyitem: 'onSelectOnlyItem'
  })
});

loadInitializers(App, config.modulePrefix);

export default App;
