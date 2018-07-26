import Service from '@ember/service';
import { notEmpty, sort } from '@ember/object/computed';

export default Service.extend({
  tasks: null,
  sortedTasks: sort('tasks', (a, b) => a.order - b.order),
  hasTasks: notEmpty('tasks'),

  init() {
    this._super(...arguments);
    this.set('tasks', []);
  },

  isSelected(task) {
    return this.tasks.includes(task);
  },

  select(...tasks) {
    let tasksToSelect = tasks.filter(task => !this.isSelected(task));
    this.tasks.pushObjects(tasksToSelect);
  },

  selectOnly() {
    this.clear();
    this.select(...arguments);
  },

  deselect(...tasks) {
    this.tasks.removeObjects(tasks);
  },

  clear() {
    this.tasks.clear();
  }
});
