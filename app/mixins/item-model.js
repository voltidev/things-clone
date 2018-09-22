import Mixin from '@ember/object/mixin';
import attr from 'ember-data/attr';
import { set, computed } from '@ember/object';
import { equal, or, alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import moment from 'moment';

const LISTS = ['inbox', 'today', 'upcoming', 'anytime', 'someday'];
const STATUSES = ['new', 'completed', 'canceled'];
export default Mixin.create({
  name: attr('string'),
  notes: attr('string'),
  order: attr('number', { defaultValue: 0 }),
  status: attr('string', { defaultValue: 'new' }),
  list: attr('string', { defaultValue: 'inbox' }),
  isDeleted: attr('boolean', { defaultValue: false }),
  deadline: attr('date'),
  upcomingAt: attr('date'),
  processedAt: attr('date'),
  deletedAt: attr('date'),

  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  isCompleted: equal('status', 'completed'),
  isCanceled: equal('status', 'canceled'),
  isProcessed: or('isCompleted', 'isCanceled'),

  isInbox: equal('list', 'inbox'),
  isToday: equal('list', 'today'),
  isUpcoming: equal('list', 'upcoming'),
  isAnytime: equal('list', 'anytime'),
  isSomeday: equal('list', 'someday'),

  currentDate: alias('clock.date'),

  isActive: computed('isProcessed', 'isDeleted', function() {
    return !this.isProcessed && !this.isDeleted;
  }),

  upcomingGroup: computed('upcomingAt', function() {
    return moment(this.upcomingAt).format('MMMM');
  }),

  logbookGroup: computed('processedAt', function() {
    return moment(this.processedAt).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'MMMM',
      sameElse: 'MMMM'
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

  markAs(status) {
    if (!STATUSES.includes(status)) {
      throw new Error(`Unknown status name: ${status}`);
    }

    if (status !== 'new') {
      set(this, 'processedAt', new Date());
    }

    set(this, 'status', status);
  },

  delete() {
    set(this, 'isDeleted', true);
    set(this, 'deletedAt', new Date());
  },

  undelete() {
    set(this, 'isDeleted', false);
  },

  moveToList(list, upcomingAt = null) {
    if (!LISTS.includes(list)) {
      throw new Error(`Unknown list name ${list}`);
    }

    if (list === 'inbox') {
      set(this, 'project', null);
    }

    set(this, 'list', list);
    set(this, 'upcomingAt', upcomingAt);
  }
});
