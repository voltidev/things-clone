import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  filteredTasks: computed('model.[]', 'model.@each.{isCompleted,isToday,isDeleted}', function() {
    return this.model.filter(task => task.isToday && !task.isCompleted && !task.isDeleted);
  }),

  tasks: computed('filteredTasks.{[],@each.order}', function() {
    return this.filteredTasks.sortBy('order');
  })
});
