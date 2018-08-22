import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { filterBy } from '@ember/object/computed';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Controller.extend({
  anytimeProjects: filterBy('model.projects', 'isShownInAnytime'),

  noProjectTasks: computed(
    'model.tasks.[]',
    'model.tasks.@each.{isShownInAnytime,hasProject}',
    function() {
      return this.model.tasks.filter(task => task.isShownInAnytime && !task.hasProject);
    }
  ),

  hasContent: computed('noProjectTasks.[]', 'anytimeProjects.[]', function() {
    return this.noProjectTasks.length || this.anytimeProjects.length;
  }),

  * eachTransition({ keptSprites, insertedSprites, removedSprites }) {
    keptSprites.forEach(move);
    insertedSprites.forEach(fadeIn);
    removedSprites.forEach(fadeOut);
  }
});
