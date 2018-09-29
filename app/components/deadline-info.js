import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias, equal, lt } from '@ember/object/computed';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  clock: service(),
  deadline: null,
  classNameBindings: ['isToday', 'isOverdue'],

  currentDate: alias('clock.date'),
  isToday: equal('daysLeft', 0),
  isOverdue: lt('daysLeft', 0),

  daysLeft: computed('currentDate', 'deadline', function() {
    // Ignoring hours and minutes
    let date = new Date(this.currentDate.toDateString());
    return moment(date).diff(this.deadline, 'days') * -1;
  }),

  deadlineInfo: computed('daysLeft', function() {
    if (this.isToday) {
      return 'today';
    }

    let daysCount = Math.abs(this.daysLeft);
    let daysOrDay = `day${daysCount > 1 ? 's' : ''}`;
    let leftOrAgo = this.isOverdue ? 'ago' : 'left';

    return `${daysCount} ${daysOrDay} ${leftOrAgo}`;
  })
});
