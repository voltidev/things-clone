import Controller from '@ember/controller';
import { filterBy, alias, notEmpty, or } from '@ember/object/computed';
import fade from 'ember-animated/transitions/fade';

export default Controller.extend({
  fade,
  areLaterItemsShown: false,
  project: alias('model'),
  anytimeTasks: filterBy('project.tasks', 'isShownInAnytime'),
  somedayTasks: filterBy('project.tasks', 'isShownInSomeday'),
  hasAnytime: notEmpty('anytimeTasks'),
  hasSomeday: notEmpty('somedayTasks'),
  hasContent: or('hasAnytime', 'hasSomeday')
});
