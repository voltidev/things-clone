import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';

function isCaretAtStart({ selectionStart, selectionEnd }) {
  return selectionStart === 0 && selectionEnd === 0;
}

export default Component.extend({
  item: null,
  editingItem: null,
  classNames: ['c-subtasks__item'],
  classNameBindings: ['isCompleted', 'isEditing'],
  isCompleted: alias('item.isCompleted'),

  isEditing: computed('item', 'editingItem', function() {
    return this.item === this.editingItem;
  }),

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.isEditing) {
      run.next(this, this.focusInput);
    }
  },

  actions: {
    startEditing() {
      this.edit(this.item);
    },

    stopEditing() {
      this.clearEditor();
      this.blurInput();
    },

    onInputKeyDown({ target, key }) {
      if (key === 'Backspace' && isCaretAtStart(target)) {
        this.blurInput();
        this.editItemAbove(this.item);
        this.deleteItem(this.item);
      }
    }
  },

  focusInput() {
    if (!this.element) {
      return;
    }

    let inputEl = this.element.querySelector('.js-input');

    inputEl.focus();
    // Move cursor to end of input.
    inputEl.selectionStart = inputEl.value.length;
    inputEl.selectionEnd = inputEl.value.length;
  },

  blurInput() {
    if (!this.element) {
      return;
    }

    let inputEl = this.element.querySelector('.js-input');

    if (inputEl === document.activeElement) {
      inputEl.blur();
    }
  }
});
