import Service from '@ember/service';
import { notEmpty } from '@ember/object/computed';

export default Service.extend({
  tasks: null,
  hasTasks: notEmpty('tasks'),

  init() {
    this._super(...arguments);
    this.set('tasks', []);
  },

  isSelected(task) {
    return this.tasks.includes(task);
  },

  select(tasks) {
    this.tasks.pushObjects(Array.isArray(tasks) ? tasks : [tasks]);
  },

  selectOnly(tasks) {
    this.clear();
    this.select(tasks);
  },

  deselect(tasks) {
    this.tasks.removeObjects(Array.isArray(tasks) ? tasks : [tasks]);
  },

  clear() {
    this.tasks.clear();
  }
});
