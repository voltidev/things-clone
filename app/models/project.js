import Model from 'ember-data/model';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import ItemModel from 'things/mixins/item-model';

export default Model.extend(ItemModel, {
  tasks: hasMany('task'),

  isShownInTrash: alias('isDeleted'),

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

  isShownInUpcoming: computed('isUpcoming', 'isActive', function() {
    return this.isUpcoming && this.isActive;
  }),

  isShownInAnytime: computed(
    'isActive',
    'tasks.[]',
    'tasks.@each.{isShownInAnytime}',
    function() {
      return this.isActive && this.tasks.any(task => task.isShownInAnytime);
    }
  ),

  isShownInSomeday: computed(
    'isActive',
    'tasks.[]',
    'tasks.@each.{isShownInSomeday}',
    function() {
      return this.isActive && this.tasks.any(task => task.isShownInSomeday);
    }
  ),

  isShownInLogbook: computed('isProcessed', 'isDeleted', function() {
    return this.isProcessed && !this.isDeleted;
  }),

  isProject: true
});
