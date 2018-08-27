import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default Helper.extend({
  itemSelector: service(),

  // eslint-disable-next-line ember/no-observers
  onSelectionChange: observer('itemSelector.items.[]', function() {
    this.recompute();
  }),

  compute([task]) {
    return this.itemSelector.isSelected(task);
  }
});
