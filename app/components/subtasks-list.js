import Component from '@ember/component';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { set } from '@ember/object';

export default Component.extend({
  editingItem: null,
  classNames: ['c-subtasks'],

  actions: {
    createItem(name) {
      let newItem = { name, isCompleted: false };
      this.items.addObject(newItem);
    },

    createItemUnder(item) {
      let itemIndex = this.items.indexOf(item);
      let newItem = { name: '', isCompleted: false };
      this.edit(newItem);
      this.items.insertAt(itemIndex + 1, newItem);
    },

    editItemAbove(item) {
      let itemIndex = this.items.indexOf(item);

      if (itemIndex > 0) {
        this.edit(this.items.objectAt(itemIndex - 1));
      }
    },

    toggleItem(item) {
      set(item, 'isCompleted', !item.isCompleted);
    },

    edit(item) {
      this.edit(item);
    },

    clearEditor() {
      set(this, 'editingItem', null);
    },

    deleteItem(item) {
      this.items.removeObject(item);
    }
  },

  edit(item) {
    set(this, 'editingItem', item);
  },

  * eachTransition({ keptSprites, insertedSprites, removedSprites }) {
    keptSprites.forEach(move);
    insertedSprites.forEach(fadeIn);
    removedSprites.forEach(fadeOut);
  }
});
