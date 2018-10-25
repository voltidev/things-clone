import Service from '@ember/service';
import { notEmpty } from '@ember/object/computed';
import { isArray } from '@ember/array';
import { computed, set } from '@ember/object';

function castArray(value = []) {
  return isArray(value) ? value : [value];
}

export default Service.extend({
  items: null,
  isNoTagMode: false,
  hasItems: notEmpty('items'),

  isAllTagsMode: computed('isNoTagMode', 'hasItems', function() {
    return !this.hasItems && !this.isNoTagMode;
  }),

  init() {
    this._super(...arguments);
    this.set('items', []);
  },

  isSelected(item) {
    return this.items.includes(item);
  },

  select(items) {
    this.items.addObjects(castArray(items));
    this.disableNoTagMode();
  },

  toggle(items) {
    castArray(items).forEach(item => {
      if (this.isSelected(item)) {
        this.deselect(item);
      } else {
        this.select(item);
      }
    });
  },

  selectOnly() {
    this.clear();
    this.select(...arguments);
  },

  deselect(items) {
    this.items.removeObjects(castArray(items));
  },

  clear() {
    this.items.clear();
    this.disableNoTagMode();
  },

  enableNoTagMode() {
    this.clear();
    set(this, 'isNoTagMode', true);
  },

  disableNoTagMode() {
    set(this, 'isNoTagMode', false);
  }
});
