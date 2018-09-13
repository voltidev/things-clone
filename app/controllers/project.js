import Controller from '@ember/controller';
import { filterBy, alias, notEmpty, or } from '@ember/object/computed';
import fade from 'ember-animated/transitions/fade';

export default Controller.extend({
  fade,
  project: alias('model'),
  anytimeTasks: filterBy('project.tasks', 'isShownInProjectAnytime'),
  somedayTasks: filterBy('project.tasks', 'isShownInProjectSomeday'),
  logbookTasks: filterBy('project.tasks', 'isShownInProjectLogbook'),

  hasAnytime: notEmpty('anytimeTasks'),
  hasSomeday: notEmpty('somedayTasks'),
  hasLogbook: notEmpty('logbookTasks'),
  hasContent: or('hasAnytime', 'hasSomeday', 'hasLogbook')
});
