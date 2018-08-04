import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredTasks: computed('model.[]', 'model.@each.{isDeleted}', function() {
    return this.model.filter(task => task.isCompleted && !task.isDeleted);
  }),

  tasks: computed('filteredTasks.{[],@each.completedAt}', function() {
    return this.filteredTasks.sortBy('completedAt');
  })
});
