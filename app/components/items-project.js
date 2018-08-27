import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  router: service(),
  itemSelector: service(),
  classNames: ['c-item', 'c-item--project', 'js-item'],
  classNameBindings: ['isCompleted', 'isSelected'],
  placeholder: 'New Project',
  isCompleted: alias('item.isCompleted'),

  isSelected: computed('itemSelector.items.[]', function() {
    return this.itemSelector.isSelected(this.item);
  }),

  mouseDown(event) {
    this.selectItem(event);
  },

  doubleClick() {
    this.router.transitionTo('project', this.item);
  },

  onSelectOnlyItem() {
    this.itemSelector.selectOnly(this.item);
  },

  onSelectItem() {
    this.itemSelector.select(this.item);
  },

  selectItem({ target, metaKey, shiftKey }) {
    if (this.element.querySelector('.js-project-pie').contains(target)) {
      return;
    }

    if (shiftKey && this.itemSelector.hasItems) {
      this.itemSelector.select(this.item);
      this.selectBetween(this.element);
    } else if (metaKey) {
      this.itemSelector.toggle(this.item);
    } else {
      this.itemSelector.selectOnly(this.item);
    }
  }
});
