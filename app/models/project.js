import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { alias, notEmpty } from '@ember/object/computed';
import ItemModel from 'things/mixins/item-model';

export default Model.extend(ItemModel, {
  tasks: hasMany('task'),

  hasActiveTasks: notEmpty('activeTasks'),
  isShownInTrash: alias('isDeleted'),

  isActive: computed('isProcessed', 'isDeleted', 'isSomeday', 'isUpcoming', function() {
    return !this.isProcessed && !this.isDeleted && !this.isSomeday && !this.isUpcoming;
  }),

  activeTasks: computed('tasks.[]', 'tasks.@each.{isActive}', function() {
    return this.tasks.filterBy('isActive', true);
  }),

  progress: computed('tasks.[]', 'tasks.@each.{isProcessed,isDeleted}', function() {
    let allTasks = this.tasks.filterBy('isDeleted', false);
    let processedTasks = allTasks.filterBy('isProcessed', true);
    let allTasksCount = allTasks.length;
    let processedTasksCount = processedTasks.length;

    if (allTasksCount === 0 || processedTasksCount === 0) {
      return 0;
    }

    return 100 / (allTasksCount / processedTasksCount);
  }),

  isShownInToday: computed('isToday', 'isActive', function() {
    return this.isToday && this.isActive;
  }),

  isShownInUpcoming: computed('isUpcoming', 'isProcessed', 'isDeleted', function() {
    return this.isUpcoming && !this.isProcessed && !this.isDeleted;
  }),

  isShownInSomeday: computed('isSomeday', 'isProcessed', 'isDeleted', function() {
    return this.isSomeday && !this.isProcessed && !this.isDeleted;
  }),

  isShownInLogbook: computed('isProcessed', 'isDeleted', function() {
    return this.isProcessed && !this.isDeleted;
  }),

  isShownInAnytimeAsGroup: computed(
    'isActive',
    'tasks.[]',
    'tasks.@each.{isShownInAnytime}',
    function() {
      return this.isActive && this.tasks.any(task => task.isShownInAnytime);
    }
  ),

  isShownInSomedayAsGroup: computed(
    'isActive',
    'tasks.[]',
    'tasks.@each.{isShownInSomeday}',
    function() {
      return this.isActive && this.tasks.any(task => task.isShownInSomeday);
    }
  ),

  isProject: true
});
