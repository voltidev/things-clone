import Service from '@ember/service';
import { set } from '@ember/object';
import { notEmpty } from '@ember/object/computed';

export default Service.extend({
  currentTask: null,
  hasTask: notEmpty('currentTask'),

  setCurrentTask(task) {
    set(this, 'currentTask', task);
  },

  isCurrent(task) {
    return task === this.currentTask;
  }
});
