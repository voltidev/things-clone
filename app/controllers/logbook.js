import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredTasks: computed(
    'model.tasks.[]',
    'model.tasks.@each.{isCompleted,isDeleted}',
    function() {
      return this.model.tasks.filter(task => task.isCompleted && !task.isDeleted);
    }
  ),

  tasks: computed('filteredTasks.{[],@each.completedAt}', function() {
    return this.filteredTasks.sort(({ completedAt: a }, { completedAt: b }) => b - a);
  })
});
