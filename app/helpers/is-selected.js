import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Helper.extend({
  taskSelector: service(),

  // eslint-disable-next-line ember/no-observers
  onSelectionChange: observer('taskSelector.tasks.[]', function() {
    this.recompute();
  }),

  compute([task]) {
    return this.taskSelector.isSelected(task);
  }
});
