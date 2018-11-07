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
      name: task.name,
      notes: task.notes,
      order: task.order,
      when: task.when,
      deadline: task.deadline,
      upcomingAt: task.upcomingAt,
      status: task.status,
      isInbox: task.isInbox,
      isDeleted: task.isDeleted,
      subtasks: task.subtasks || [],
      processedAt: task.processedAt,
      deletedAt: task.deletedAt,
      project: task.project,
      tags: task.tags.toArray()
    });
  },

  clear() {
    set(this, 'task', null);
  }
});
