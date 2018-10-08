import Service from '@ember/service';
import { set, get } from '@ember/object';
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
      when: task.when,
      deadline: task.deadline,
      upcomingAt: task.upcomingAt,
      status: task.status,
      isInbox: task.isInbox,
      isDeleted: task.isDeleted,
      project: task.project,
      tags: task.tags.toArray(),
      subtasks: task.subtasks || []
    };

    set(this, 'task', Object.assign({}, taskData));
    set(this, '_originalTask', Object.assign({}, taskData));
  },

  getChangedAttributes() {
    if (!this.hasTask) {
      return [];
    }

    let changes = Object.keys(this.task).reduce((changedAttrs, attr) => {
      if (this.task[attr] !== this._originalTask[attr]) {
        changedAttrs.push(attr);
      }

      return changedAttrs;
    }, []);

    if (get(this, '_originalTask.project.id') !== get(this, 'task.project.id')) {
      changes.push('project');
    }

    changes.push('subtasks');
    changes.push('tags');

    return changes;
  },

  clear() {
    set(this, 'task', null);
  }
});
