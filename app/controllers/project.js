import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  project: alias('model'),

  filteredTasks: computed(
    'project.tasks.[]',
    'project.tasks.@each.{isCompleted,isAnytime,isDeleted}',
    function() {
      return this.project.tasks.filter(
        task => task.isAnytime && !task.isCompleted && !task.isDeleted
      );
    }
  ),

  tasks: computed('filteredTasks.{[],@each.order}', function() {
    return this.filteredTasks.sortBy('order');
  })
});
