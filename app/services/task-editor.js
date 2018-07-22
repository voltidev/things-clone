import Service from '@ember/service';
import { set } from '@ember/object';
import { notEmpty } from '@ember/object/computed';

export default Service.extend({
  task: null,
  hasTask: notEmpty('task'),

  isEditing(task) {
    return task === this.task;
  },

  edit(task) {
    set(this, 'task', task);
  },

  clear() {
    set(this, 'task', null);
  }
});
