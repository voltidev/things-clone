import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredTasks: computed('model.[]', 'model.@each.{isCompleted,isDeleted}', function() {
    return this.model.filter(task => task.isCompleted && !task.isDeleted);
  }),

  tasks: computed('filteredTasks.{[],@each.completedAt}', function() {
    return this.filteredTasks.sort(({ completedAt: a }, { completedAt: b }) => b - a);
  })
});
