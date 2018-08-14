import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('inbox');
  this.route('logbook');
  this.route('trash');
  this.route('someday');
  this.route('today');
  this.route('anytime');
  this.route('project', { path: '/project/:id' });
});

export default Router;
