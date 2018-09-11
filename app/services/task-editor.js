import Service from '@ember/service';
import { set } from '@ember/object';
import { notEmpty } from '@ember/object/computed';

export default Service.extend({
  task: null,
  hasTask: notEmpty('task'),

  isEditing(task) {
    return this.hasTask && task.id === this.task.id;
  },

  edit(task) {
    set(this, 'task', {
      id: task.id,
      isCompleted: task.isCompleted,
      name: task.name,
      notes: task.notes,
      deadline: task.deadline
    });
  },

  clear() {
    set(this, 'task', null);
  }
});
