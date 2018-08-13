import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredTasks: computed('model.{[],@each.isDeleted,@each.deletedAt}', function() {
    return this.model.filter(task => task.isDeleted);
  }),

  tasks: computed('filteredTasks.{[],@each.deletedAt}', function() {
    return this.filteredTasks.sort(({ deletedAt: a }, { deletedAt: b }) => b - a);
  })
});
