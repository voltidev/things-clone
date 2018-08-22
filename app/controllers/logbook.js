import Controller from '@ember/controller';
import { filterBy, notEmpty } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  hasContent: notEmpty('filteredTasks'),
  filteredTasks: filterBy('model.tasks', 'isShownInLogbook'),

  tasks: computed('filteredTasks.{[],@each.completedAt}', function() {
    return this.filteredTasks.sort(({ completedAt: a }, { completedAt: b }) => b - a);
  })
});
