import Service, { inject as service } from '@ember/service';
import { set, computed } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { union } from '@ember/object/computed';
import moment from 'moment';

function isTimeout(item, now) {
  let daysLeft = moment(now).diff(item.upcomingAt, 'days') * -1;
  return daysLeft <= 0;
}

export default Service.extend({
  store: service(),
  tasks: null,
  projects: null,

  tasksAndProjects: union('tasks', 'projects'),

  upcomingItems: computed('tasksAndProjects.[]', 'tasksAndProjects.@each.{isUpcoming}', function() {
    return this.tasksAndProjects.filterBy('isUpcoming', true);
  }),

  init() {
    this._super(...arguments);

    set(this, 'tasks', this.store.peekAll('task'));
    set(this, 'projects', this.store.peekAll('project'));
    this.get('store').findAll('task');
    this.get('store').findAll('project');

    this.updateUpcomingItems.perform();
  },

  updateUpcomingItems: task(function* () {
    while (true) {
      yield timeout(2000);
      let now = new Date(new Date().toDateString());

      this.upcomingItems
        .filter(item => isTimeout(item, now))
        .forEach(todayItem => {
          todayItem.setWhen('today');
          todayItem.save();
        });
    }
  }).drop(),
});
