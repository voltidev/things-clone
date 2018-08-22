import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { filterBy, alias, notEmpty } from '@ember/object/computed';

export default Controller.extend({
  project: alias('model'),
  filteredTasks: filterBy('project.tasks', 'isShownInAnytime'),
  hasContent: notEmpty('filteredTasks'),

  tasks: computed('filteredTasks.{[],@each.order}', function() {
    return this.filteredTasks.sortBy('order');
  })
});
