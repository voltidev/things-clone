import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Helper.extend({
  tagsFilter: service(),

  // eslint-disable-next-line ember/no-observers
  onTagsFilterChange: observer(
    'tagsFilter.items.[]',
    'tagsFilter.isNoTagMode',
    function() {
      this.recompute();
    }
  ),

  compute([items]) {
    if (this.tagsFilter.isAllTagsMode) {
      return items;
    }

    if (this.tagsFilter.isNoTagMode) {
      return items.filter(item => isEmpty(item.tags));
    }

    return items.filter(item => item.tags.any(tag => this.tagsFilter.isSelected(tag)));
  }
});
