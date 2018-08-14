import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredTasks: computed('model.[]', 'model.@each.{isCompleted,isAnytime,isDeleted}', function() {
    return this.model.filter(task => task.isAnytime && !task.isCompleted && !task.isDeleted);
  }),

  tasks: computed('filteredTasks.{[],@each.order}', function() {
    return this.filteredTasks.sortBy('order');
  })
});
