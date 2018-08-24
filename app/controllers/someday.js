import Controller from '@ember/controller';
import { filterBy, notEmpty, or } from '@ember/object/computed';
import { computed } from '@ember/object';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Controller.extend({
  isProjectListShown: false,
  hasTasks: notEmpty('noProjectTasks'),
  hasProjects: notEmpty('somedayProjects'),
  hasContent: or('hasTasks', 'hasProjects'),
  somedayProjects: filterBy('model.projects', 'isShownInSomeday'),

  noProjectTasks: computed(
    'model.tasks.[]',
    'model.tasks.@each.{isShownInSomeday,hasProject}',
    function() {
      return this.model.tasks.filter(task => task.isShownInSomeday && !task.hasProject);
    }
  ),

  * eachTransition({ keptSprites, insertedSprites, removedSprites }) {
    keptSprites.forEach(move);
    insertedSprites.forEach(fadeIn);
    removedSprites.forEach(fadeOut);
  }
});
