import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { run } from '@ember/runloop';

export default Component.extend({
  taskEditor: service(),
  itemSelector: service(),
  router: service(),
  classNames: ['c-item', 'js-item'],
  classNameBindings: ['isEditing', 'isCompleted', 'isSelected', 'isSortable'],
  task: null,
  placeholder: 'New To-Do',
  isCompleted: alias('task.isCompleted'),
  isSortable: not('isEditing'),

  isProjectShown: computed('router.currentRouteName', function() {
    return ['logbook', 'trash', 'today'].includes(this.router.currentRouteName);
  }),

  isEditing: computed('taskEditor.task', function() {
    return this.taskEditor.isEditing(this.task);
  }),

  isSelected: computed('itemSelector.items.[]', function() {
    return this.itemSelector.isSelected(this.task);
  }),

  init() {
    this._super(...arguments);
    this.stopEditingOnSideClick = this.stopEditingOnSideClick.bind(this);
  },

  didRender() {
    this._super(...arguments);

    if (this.isEditing) {
      this.focusInput();
      this.startHandlingRootClick();
    } else {
      this.stopHandlingRootClick();
    }
  },

  willDestroyElement() {
    this.stopHandlingRootClick();
    this.stopEditing();
    this.itemSelector.deselect(this.task);
  },

  actions: {
    stopEditing() {
      this.stopEditing();
    },

    updateName(name) {
      this.updateItemName(this.task, name);
    },

    toggleTaskCompletion() {
      if (this.isCompleted) {
        this.uncompleteItem(this.task);
      } else {
        this.completeItem(this.task);
      }
    }
  },

  mouseDown(event) {
    this.selectTask(event);
  },

  doubleClick() {
    this.startEditing();
  },

  onSelectOnlyItem() {
    this.itemSelector.selectOnly(this.task);
  },

  onSelectItem() {
    this.itemSelector.select(this.task);
  },

  focusInput() {
    let input = this.element.querySelector('.js-item-input');

    if (input) {
      input.focus();
    }
  },

  selectTask({ target, metaKey, shiftKey }) {
    if (target.classList.contains('js-checkbox')) {
      return;
    }

    if (shiftKey && this.itemSelector.hasItems) {
      this.itemSelector.select(this.task);
      this.selectBetween(this.element);
    } else if (metaKey) {
      this.itemSelector.toggle(this.task);
    } else {
      this.itemSelector.selectOnly(this.task);
    }
  },

  startEditing() {
    if (!this.isEditing) {
      this.taskEditor.edit(this.task);
    }
  },

  stopEditing() {
    if (this.isEditing) {
      this.taskEditor.clear();
    }
  },

  startHandlingRootClick() {
    document.addEventListener('mousedown', this.stopEditingOnSideClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('mousedown', this.stopEditingOnSideClick, true);
  },

  stopEditingOnSideClick(event) {
    run(() => {
      let isInternalClick = this.element.contains(event.target);

      if (!isInternalClick) {
        this.stopEditing();
      }
    });
  }
});
