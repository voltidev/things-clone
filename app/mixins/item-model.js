import Mixin from '@ember/object/mixin';
import attr from 'ember-data/attr';
import { set, computed } from '@ember/object';
import { equal, or } from '@ember/object/computed';
import moment from 'moment';

function isThisYear(date) {
  return date.getFullYear() === (new Date()).getFullYear();
}

const WHEN = ['today', 'upcoming', 'anytime', 'someday'];
const STATUSES = ['new', 'completed', 'canceled'];
export default Mixin.create({
  name: attr('string'),
  notes: attr('string'),
  order: attr('number', { defaultValue: 0 }),
  status: attr('string', { defaultValue: 'new' }),
  when: attr('string', { defaultValue: 'anytime' }),
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

  isToday: equal('when', 'today'),
  isUpcoming: equal('when', 'upcoming'),
  isAnytime: equal('when', 'anytime'),
  isSomeday: equal('when', 'someday'),

  isActive: computed('isProcessed', 'isDeleted', function() {
    return !this.isProcessed && !this.isDeleted;
  }),

  upcomingGroup: computed('upcomingAt', function() {
    let format = isThisYear(this.upcomingAt) ? 'MMMM' : 'MMMM, YYYY';
    return moment(this.upcomingAt).format(format);
  }),

  logbookGroup: computed('processedAt', function() {
    let format = isThisYear(this.processedAt) ? 'MMMM' : 'MMMM, YYYY';

    return moment(this.processedAt).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: format,
      sameElse: format
    });
  }),

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

  setWhen(when, date = null) {
    if (when && !WHEN.includes(when)) {
      throw new Error(`Unknown value for "when": ${when}`);
    }

    set(this, 'when', when);
    set(this, 'upcomingAt', date);
  }
});
