import Controller from '@ember/controller';
import { filterBy, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  hasContent: notEmpty('filteredTasks'),
  filteredTasks: filterBy('model.tasks', 'isShownInTrash'),

  tasks: computed('filteredTasks.{[],@each.deletedAt}', function() {
    return this.filteredTasks.sort(({ deletedAt: a }, { deletedAt: b }) => b - a);
  })
});
