import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';
import { set, computed } from '@ember/object';
import { equal, alias } from '@ember/object/computed';
import ItemModel from 'things/mixins/item-model';

export default Model.extend(ItemModel, {
  project: belongsTo('project'),

  isProjectDeleted: equal('project.isDeleted', true),
  isShownInTrash: alias('isDeleted'),

  hasProject: computed('project', function() {
    return this.belongsTo('project').id() !== null;
  }),

  isShownInInbox: computed('isInbox', 'isActive', function() {
    return this.isInbox && this.isActive;
  }),

  isShownInToday: computed('isToday', 'isActive', 'isProjectDeleted', function() {
    return this.isToday && this.isActive && !this.isProjectDeleted;
  }),

  isShownInUpcoming: computed('isUpcoming', 'isActive', 'isProjectDeleted', function() {
    return this.isUpcoming && this.isActive && !this.isProjectDeleted;
  }),

  isShownInAnytime: computed('isAnytime', 'isToday', 'isActive', 'isProjectDeleted', function() {
    return (this.isAnytime || this.isToday) && this.isActive && !this.isProjectDeleted;
  }),

  isShownInSomeday: computed('isSomeday', 'isActive', 'isProjectDeleted', function() {
    return this.isSomeday && this.isActive && !this.isProjectDeleted;
  }),

  isShownInLogbook: computed('isProcessed', 'isDeleted', 'isProjectDeleted', function() {
    return this.isProcessed && !this.isDeleted && !this.isProjectDeleted;
  }),

  isShownInProjectAnytime: computed('isAnytime', 'isToday', 'isActive', function() {
    return (this.isAnytime || this.isToday) && this.isActive;
  }),

  isShownInProjectSomeday: computed('isSomeday', 'isActive', function() {
    return this.isSomeday && this.isActive;
  }),

  isShownInProjectLogbook: computed('isProcessed', 'isDeleted', function() {
    return this.isProcessed && !this.isDeleted;
  }),

  isTask: true,

  moveToProject(project) {
    set(this, 'project', project);

    if (this.isInbox) {
      set(this, 'list', 'anytime');
    }

    if (project) {
      let lastTask = project.tasks.sortBy('order').lastObject;
      set(this, 'order', lastTask ? lastTask.order + 1 : 0);
    }
  }
});
