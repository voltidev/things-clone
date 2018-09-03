import Service from '@ember/service';
import { task, timeout } from 'ember-concurrency';

const INTERVAL = 30000;

export default Service.extend({
  date: null,

  updateDate: task(function* () {
    while (true) {
      yield timeout(INTERVAL);
      this.set('date', new Date());
    }
  }).drop(),

  init() {
    this._super(...arguments);
    this.set('date', new Date());
    this.start();
  },

  start() {
    this.updateDate.perform();
  },

  stop() {
    this.updateDate.cancelAll();
  }
});
