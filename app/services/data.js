import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default Service.extend({
  store: service(),
  tasks: null,
  projects: null,

  init() {
    this._super(...arguments);

    set(this, 'tasks', this.store.peekAll('task'));
    set(this, 'projects', this.store.peekAll('project'));

    this.get('store').findAll('task');
    this.get('store').findAll('project');
  }
});
