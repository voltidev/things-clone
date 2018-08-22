import Controller from '@ember/controller';
import { filterBy, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  hasContent: notEmpty('filteredTasks'),
  filteredTasks: filterBy('model.tasks', 'isShownInToday'),

  tasks: computed('filteredTasks.{[],@each.order}', function() {
    return this.filteredTasks.sortBy('order');
  })
});
