import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';

export default Component.extend({
  taskEditor: service(),
  taskSelector: service(),
  classNames: ['c-task', 'js-task'],
  classNameBindings: ['isEditing', 'isCompleted'],
  task: null,
  placeholder: 'New To-Do',
  isCompleted: alias('task.isCompleted'),

  isEditing: computed('taskEditor.task', function() {
    return this.taskEditor.isEditing(this.task);
  }),

  isSelected: computed('taskSelector.tasks.[]', function() {
    return this.taskSelector.isSelected(this.task);
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
    this.taskSelector.deselect(this.task);
  },

  actions: {
    onEnter() {
      this.stopEditing();
    },

    onEscape() {
      this.stopEditing();
    },

    toggleTask(isChecked) {
      if (isChecked) {
        this.completeTask(this.task);
      } else {
        this.uncompleteTask(this.task);
      }
    }
  },

  mouseDown(event) {
    this.selectTask(event);
  },

  doubleClick() {
    this.startEditing();
  },

  focusInput() {
    let input = this.element.querySelector('.js-task-input');

    if (input) {
      input.focus();
    }
  },

  selectTask({ target, metaKey, shiftKey }) {
    if (target.classList.contains('js-checkbox')) {
      return;
    }

    if (shiftKey && this.taskSelector.hasTasks) {
      this.selectBetween(this.task);
    } else if (metaKey) {
      this.taskSelector.toggle(this.task);
    } else {
      this.taskSelector.selectOnly(this.task);
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

    this.taskEditor.clear();
    this.saveTask(this.task);
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
