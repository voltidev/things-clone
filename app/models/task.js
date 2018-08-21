import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { set, computed } from '@ember/object';
import { equal } from '@ember/object/computed';
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

  logbookGroup: computed('completedAt', function() {
    return moment(this.completedAt).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'MMMM',
      sameElse: 'MMMM'
    });
  }),

  complete() {
    set(this, 'isCompleted', true);
    set(this, 'completedAt', new Date());

    if (this.isToday) {
      this.moveToFolder('anytime');
    }
  },

  uncomplete() {
    set(this, 'isCompleted', false);
  },

  delete() {
    set(this, 'isDeleted', true);
    set(this, 'deletedAt', new Date());

    if (this.isToday) {
      this.moveToFolder('anytime');
    }
  },

  undelete() {
    set(this, 'isDeleted', false);
  },

  moveToFolder(folder) {
    if (!FOLDERS.includes(folder)) {
      throw new Error(`Unknown folder name ${folder}`);
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
