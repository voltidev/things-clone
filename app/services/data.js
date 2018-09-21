import Service, { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import moment from 'moment';

function isTimeout(item, now) {
  if (!item.upcomingAt) {
    return false;
  }

  let daysLeft = moment(now).diff(item.upcomingAt, 'days') * -1;
  return daysLeft <= 0;
}

export default Service.extend({
  store: service(),
  tasks: null,
  projects: null,

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
      yield timeout(5000);
      let now = new Date(new Date().toDateString());

      this.tasks
        .filter(item => isTimeout(item, now))
        .forEach(todayItem => {
          todayItem.moveToList('today');
          todayItem.save();
        });
    }
  }).drop(),
});
