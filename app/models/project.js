import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { set, computed } from '@ember/object';
import { or } from '@ember/object/computed';

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

  isCompletedOrDeleted: or('isCompleted', 'isDeleted'),

  isShownInAnytime: computed(
    'isCompletedOrDeleted',
    'tasks.[]',
    'tasks.@each.{isShownInAnytime}',
    function() {
      return !this.isCompletedOrDeleted && this.tasks.any(task => task.isShownInAnytime);
    }
  ),

  isShownInSomeday: computed(
    'isCompletedOrDeleted',
    'tasks.[]',
    'tasks.@each.{isShownInSomeday}',
    function() {
      return !this.isCompletedOrDeleted && this.tasks.any(task => task.isShownInSomeday);
    }
  ),

  complete() {
    set(this, 'isCompleted', true);
    set(this, 'completedAt', new Date());
    this.tasks.forEach(task => task.unstar());
  },

  delete() {
    set(this, 'isDeleted', true);
    set(this, 'deletedAt', new Date());
    this.tasks.forEach(task => task.unstar());
  },

  undelete() {
    set(this, 'isDeleted', false);
  },

  uncomplete() {
    set(this, 'isCompleted', false);
  }
});
