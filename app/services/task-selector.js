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
    this.tasks.pushObjects(tasks);
  },

  selectOnly(task) {
    this.clear();
    this.select([task]);
  },

  deselect(tasks) {
    this.tasks.removeObjects(tasks);
  },

  clear() {
    this.tasks.clear();
  }
});
