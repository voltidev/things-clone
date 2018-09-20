import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { set, computed } from '@ember/object';
import { equal, or, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';

const LISTS = ['today', 'anytime', 'someday'];

export default Model.extend({
  name: attr('string'),
  order: attr('number', { defaultValue: 0 }),
  list: attr('string', { defaultValue: 'anytime' }),
  isCompleted: attr('boolean', { defaultValue: false }),
  isCanceled: attr('boolean', { defaultValue: false }),
  isDeleted: attr('boolean', { defaultValue: false }),
  deadline: attr('date'),
  processedAt: attr('date'),
  deletedAt: attr('date'),

  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  tasks: hasMany('task'),

  isToday: equal('list', 'today'),
  isAnytime: equal('list', 'anytime'),
  isSomeday: equal('list', 'someday'),

  currentDate: alias('clock.date'),
  isShownInTrash: alias('isDeleted'),
  isProcessed: or('isCompleted', 'isCanceled'),

  isActive: computed('isProcessed', 'isDeleted', function() {
    return !this.isProcessed && !this.isDeleted;
  }),

  activeTasks: computed('tasks.[]', 'tasks.@each.{isActive}', function() {
    return this.tasks.filterBy('isActive', true);
  }),

  progress: computed('tasks.[]', 'tasks.@each.{isProcessed,isDeleted}', function() {
    let allTasks = this.tasks.filterBy('isDeleted', false);
    let processedTasks = allTasks.filterBy('isProcessed', true);
    let allTasksCount = allTasks.length;
    let processedTasksCount = processedTasks.length;

    if (allTasksCount === 0 || processedTasksCount === 0) {
      return 0;
    }

    return 100 / (allTasksCount / processedTasksCount);
  }),


  isShownInAnytime: computed(
    'isActive',
    'tasks.[]',
    'tasks.@each.{isShownInAnytime}',
    function() {
      return this.isActive && this.tasks.any(task => task.isShownInAnytime);
    }
  ),

  isShownInSomeday: computed(
    'isActive',
    'tasks.[]',
    'tasks.@each.{isShownInSomeday}',
    function() {
      return this.isActive && this.tasks.any(task => task.isShownInSomeday);
    }
  ),

  isShownInLogbook: computed('isCompleted', 'isCanceled', 'isDeleted', function() {
    return (this.isCompleted || this.isCanceled) && !this.isDeleted;
  }),

  logbookGroup: computed('processedAt', function() {
    return moment(this.processedAt).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'MMMM',
      sameElse: 'MMMM'
    });
  }),

  processedAtDisplay: computed('processedAt', function() {
    return moment(this.processedAt).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'MMM DD',
      sameElse: 'MMM DD'
    });
  }),

  daysLeft: computed('currentDate', 'deadline', function() {
    if (!this.deadline) {
      return 0;
    }

    // Ignoring time
    let date = new Date(this.currentDate.toDateString());
    return moment(date).diff(this.deadline, 'days') * -1;
  }),

  isDeadline: computed('daysLeft', function() {
    return this.daysLeft <= 0;
  }),

  deadlineDisplay: computed('daysLeft', function() {
    let days = Math.abs(this.daysLeft);
    let lastWord = this.daysLeft > 0 ? 'left' : 'ago';

    if (days === 0) {
      return 'today';
    }

    return `${days} day${days === 1 ? '' : 's'} ${lastWord}`;
  }),

  clock: service(),
  isProject: true,

  complete() {
    set(this, 'isCompleted', true);
    set(this, 'isCanceled', false);
    set(this, 'processedAt', new Date());
    this.unstar();
  },

  cancel() {
    set(this, 'isCanceled', true);
    set(this, 'isCompleted', false);
    set(this, 'processedAt', new Date());
    this.unstar();
  },

  uncomplete() {
    set(this, 'isCompleted', false);
    set(this, 'isCanceled', false);
  },

  delete() {
    set(this, 'isDeleted', true);
    set(this, 'deletedAt', new Date());
  },

  undelete() {
    set(this, 'isDeleted', false);
  },

  moveToList(list) {
    if (!LISTS.includes(list)) {
      throw new Error(`Unknown list name ${list} for project`);
    }

    set(this, 'list', list);
  },

  unstar() {
    if (this.isToday) {
      set(this, 'list', 'anytime');
    }
  }
});
