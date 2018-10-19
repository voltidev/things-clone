import Controller from '@ember/controller';
import { filterBy, alias, notEmpty, or } from '@ember/object/computed';
import fade from 'ember-animated/transitions/fade';

export default Controller.extend({
  fade,
  project: alias('model'),
  anytimeTasks: filterBy('project.tasks', 'isShownInProjectAnytime'),
  upcomingTasks: filterBy('project.tasks', 'isShownInProjectUpcoming'),
  somedayTasks: filterBy('project.tasks', 'isShownInProjectSomeday'),
  logbookTasks: filterBy('project.tasks', 'isShownInProjectLogbook'),

  hasAnytime: notEmpty('anytimeTasks'),
  hasUpcoming: notEmpty('upcomingTasks'),
  hasSomeday: notEmpty('somedayTasks'),
  hasLogbook: notEmpty('logbookTasks'),
  hasContent: or('hasAnytime', 'hasUpcoming', 'hasSomeday', 'hasLogbook')
});
