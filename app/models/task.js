import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { set, computed } from '@ember/object';
import { equal, or, alias } from '@ember/object/computed';
import moment from 'moment';

const FOLDERS = ['inbox', 'today', 'anytime', 'someday'];

export default Model.extend({
  name: attr('string'),
  order: attr('number', { defaultValue: 0 }),
  isCompleted: attr('boolean', { defaultValue: false }),
  completedAt: attr('date'),
  deletedAt: attr('date'),
  folder: attr('string', { defaultValue: 'inbox' }),
  isDeleted: attr('boolean', { defaultValue: false }),

  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  project: belongsTo('project'),

  isInbox: equal('folder', 'inbox'),
  isToday: equal('folder', 'today'),
  isAnytime: equal('folder', 'anytime'),
  isSomeday: equal('folder', 'someday'),

  isCompletedOrDeleted: or('isCompleted', 'isDeleted'),
  isShownInTrash: alias('isDeleted'),

  hasProject: computed('project', function() {
    return this.belongsTo('project').id() !== null;
  }),

  isShownInInbox: computed('isInbox', 'isCompletedOrDeleted', function() {
    return this.isInbox && !this.isCompletedOrDeleted;
  }),

  isShownInToday: computed('isToday', 'isCompletedOrDeleted', function() {
    return this.isToday && !this.isCompletedOrDeleted;
  }),

  isShownInAnytime: computed('isAnytime', 'isToday', 'isCompletedOrDeleted', function() {
    return (this.isAnytime || this.isToday) && !this.isCompletedOrDeleted;
  }),

  isShownInSomeday: computed('isSomeday', 'isCompletedOrDeleted', function() {
    return this.isSomeday && !this.isCompletedOrDeleted;
  }),

  isShownInLogbook: computed('isCompleted', 'isDeleted', function() {
    return this.isCompleted && !this.isDeleted;
  }),

  logbookGroup: computed('completedAt', function() {
    return moment(this.completedAt).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'MMMM',
      sameElse: 'MMMM'
    });
  }),

  completedAtDisplay: computed('completedAt', function() {
    return moment(this.completedAt).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'MMMM',
      sameElse: 'MMMM'
    });
  }),

  isTask: true,

  unstar() {
    if (this.isToday) {
      set(this, 'folder', 'anytime');
    }
  },

  complete() {
    set(this, 'isCompleted', true);
    set(this, 'completedAt', new Date());
    this.unstar();
  },

  uncomplete() {
    set(this, 'isCompleted', false);
  },

  delete() {
    set(this, 'isDeleted', true);
    set(this, 'deletedAt', new Date());
    this.unstar();
  },

  undelete() {
    set(this, 'isDeleted', false);
  },

  moveToFolder(folder) {
    if (!FOLDERS.includes(folder)) {
      throw new Error(`Unknown folder name ${folder}`);
    }

    if (folder === 'today' && this.get('project.isDeleted')) {
      return;
    }

    if (folder === 'inbox') {
      set(this, 'project', null);
    }

    set(this, 'folder', folder);
  },

  moveToProject(project) {
    let lastTask = project.tasks.sortBy('order').lastObject;
    let nextTaskOrder = lastTask ? lastTask.order + 1 : 0;

    set(this, 'project', project);
    set(this, 'order', nextTaskOrder);

    if (this.isInbox) {
      this.moveToFolder('anytime');
    }
  },

  removeFromProject() {
    set(this, 'project', null);
  }
});
