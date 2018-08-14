import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredTasks: computed('model.tasks.{[],@each.isDeleted,@each.deletedAt}', function() {
    return this.model.tasks.filter(task => task.isDeleted);
  }),

  tasks: computed('filteredTasks.{[],@each.deletedAt}', function() {
    return this.filteredTasks.sort(({ deletedAt: a }, { deletedAt: b }) => b - a);
  })
});
