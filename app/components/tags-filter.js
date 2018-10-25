import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  tagsFilter: service(),

  classNames: ['c-tags-filter'],
  isNoTagMode: alias('tagsFilter.isNoTagMode'),
  isAllTagsMode: alias('tagsFilter.isAllTagsMode'),

  actions: {
    selectItem(item) {
      this.tagsFilter.selectOnly(item);
    },

    toggleItem(item) {
      this.tagsFilter.toggle(item);
    },

    clearFilter() {
      this.tagsFilter.clear();
    },

    enableNoTagMode() {
      this.tagsFilter.enableNoTagMode();
    }
  }
});
