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
  classNameBindings: ['isEditing', 'isCompleted', 'isSelected', 'isSortable', 'isSomeday'],
  task: null,
  isEditorInitialized: false,
  placeholder: 'New To-Do',
  isCompleted: alias('task.isCompleted'),
  isSomeday: alias('task.isShownInSomeday'),
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

    if (!this.isEditing && this.isEditorInitialized) {
      this.set('isEditorInitialized', false);
      this.stopHandlingRootClick();
    }

    if (this.isEditing && !this.isEditorInitialized) {
      this.set('isEditorInitialized', true);
      this.focusInput();
      this.startHandlingRootClick();
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
    if (this.isEditing) {
      return;
    }

    this.taskEditor.edit(this.task);
  },

  stopEditing() {
    if (!this.isEditing) {
      return;
    }

    let { isCompleted, name, notes, deadline } = this.taskEditor.task;

    if (this.task.isCompleted !== isCompleted) {
      (isCompleted ? this.completeItem : this.uncompleteItem)(this.task);
    }

    if (this.task.name !== name) {
      this.updateItemName(this.task, name);
    }

    if (this.task.notes !== notes) {
      this.updateItemNotes(this.task, notes);
    }

    if (this.task.deadline !== deadline) {
      this.setItemsDeadline([this.task], deadline);
    }

    this.taskEditor.clear();
  },

  startHandlingRootClick() {
    document.addEventListener('mousedown', this.stopEditingOnSideClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('mousedown', this.stopEditingOnSideClick, true);
  },

  stopEditingOnSideClick({ target }) {
    run(() => {
      let isInternalClick = this.element.contains(target);
      let isItemsActions = [...document.querySelectorAll('.js-items-actions')]
        .some(el => el.contains(target));

      if (!isInternalClick && !isItemsActions) {
        this.stopEditing();
      }
    });
  }
});
