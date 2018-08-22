import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { set, computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  order: attr('number', { defaultValue: 0 }),
  isCompleted: attr('boolean', { defaultValue: false }),
  isDeleted: attr('boolean', { defaultValue: false }),
  completedAt: attr('date'),
  deletedAt: attr('date'),

  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  tasks: hasMany('task'),

  isShownInAnytime: computed('tasks.[]', 'tasks.@each.{isShownInAnytime}', function() {
    return this.tasks.any(task => task.isShownInAnytime);
  }),

  complete() {
    set(this, 'isCompleted', true);
    set(this, 'completedAt', new Date());
  },

  delete() {
    set(this, 'isDeleted', true);
    set(this, 'deletedAt', new Date());
  },

  uncomplete() {
    set(this, 'isCompleted', false);
  }
});
