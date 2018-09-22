import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { set, computed } from '@ember/object';
import { equal, alias } from '@ember/object/computed';
import ItemModel from 'things/mixins/item-model';

export default Model.extend(ItemModel, {
  isInbox: attr('boolean', { defaultValue: true }),
  project: belongsTo('project'),

  isProjectDeleted: equal('project.isDeleted', true),
  isShownInTrash: alias('isDeleted'),

  hasProject: computed('project', function() {
    return this.belongsTo('project').id() !== null;
  }),

  isShownInInbox: computed('isInbox', 'isActive', function() {
    return this.isInbox && this.isActive;
  }),

  isShownInToday: computed('isToday', 'isActive', 'isInbox', 'isProjectDeleted', function() {
    return this.isToday && this.isActive && !this.isInbox && !this.isProjectDeleted;
  }),

  isShownInUpcoming: computed('isUpcoming', 'isActive', 'isInbox', 'isProjectDeleted', function() {
    return this.isUpcoming && this.isActive && !this.isInbox && !this.isProjectDeleted;
  }),

  isShownInAnytime: computed('isAnytime', 'isToday', 'isActive', 'isInbox', 'isProjectDeleted', function() {
    return (this.isAnytime || this.isToday) && this.isActive && !this.isInbox && !this.isProjectDeleted;
  }),

  isShownInSomeday: computed('isSomeday', 'isActive', 'isInbox', 'isProjectDeleted', function() {
    return this.isSomeday && this.isActive && !this.isInbox && !this.isProjectDeleted;
  }),

  isShownInLogbook: computed('isProcessed', 'isDeleted', 'isProjectDeleted', function() {
    return this.isProcessed && !this.isDeleted && !this.isProjectDeleted;
  }),

  isShownInProjectAnytime: computed('isAnytime', 'isToday', 'isActive', 'isInbox', function() {
    return (this.isAnytime || this.isToday) && this.isActive && !this.isInbox;
  }),

  isShownInProjectSomeday: computed('isSomeday', 'isActive', 'isInbox', function() {
    return this.isSomeday && this.isActive && !this.isInbox;
  }),

  isShownInProjectLogbook: computed('isProcessed', 'isDeleted', function() {
    return this.isProcessed && !this.isDeleted;
  }),

  isTask: true,

  setWhen() {
    this._super(...arguments);
    set(this, 'isInbox', false);
  },

  moveToInbox() {
    set(this, 'isInbox', true);
    set(this, 'when', 'anytime');
    set(this, 'project', null);
  },

  moveToProject(project) {
    set(this, 'project', project);
    set(this, 'isInbox', false);

    if (project) {
      let lastTask = project.tasks.sortBy('order').lastObject;
      set(this, 'order', lastTask ? lastTask.order + 1 : 0);
    }
  }
});
