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
    let taskData = {
      id: task.id,
      name: task.name,
      notes: task.notes,
      list: task.list,
      deadline: task.deadline,
      status: task.status,
      isDeleted: task.isDeleted,
      project: task.project
    };

    set(this, 'task', Object.assign({}, taskData));
    set(this, '_originalTask', Object.assign({}, taskData));
  },

  getChangedAttributes() {
    if (!this.hasTask) {
      return [];
    }

    return Object.keys(this.task).reduce((changedAttrs, attr) => {
      if (this.task[attr] !== this._originalTask[attr]) {
        changedAttrs.push(attr);
      }

      return changedAttrs;
    }, []);
  },

  clear() {
    set(this, 'task', null);
  }
});
