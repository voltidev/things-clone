import Controller from '@ember/controller';
import { filterBy, notEmpty, union } from '@ember/object/computed';

export default Controller.extend({
  tasksAndProjects: union('model.tasks', 'model.projects'),
  items: filterBy('tasksAndProjects', 'isShownInLogbook'),
  hasContent: notEmpty('items')
});
