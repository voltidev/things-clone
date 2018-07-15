import Service from '@ember/service';
import { set } from '@ember/object';

export default Service.extend({
  selectedTask: null,

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
