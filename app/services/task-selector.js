import Service from '@ember/service';
import { set } from '@ember/object';
import { notEmpty } from '@ember/object/computed';

export default Service.extend({
  selectedTask: null,
  hasSelected: notEmpty('selectedTask'),

  isSelected(task) {
    return task === this.selectedTask;
  },

  select(task) {
    set(this, 'selectedTask', task);
  },

  clear() {
    set(this, 'selectedTask', null);
  }
});
