import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tagsFilter: service(),
  classNames: ['c-tags-filter__item'],
  classNameBindings: ['isSelected'],
  item: null,

  isSelected: computed('tagsFilter.items.[]', function() {
    return this.tagsFilter.isSelected(this.item);
  }),

  mouseDown({ metaKey }) {
    if (metaKey) {
      this.toggleItem(this.item);
    } else {
      this.selectItem(this.item);
    }
  }
});
