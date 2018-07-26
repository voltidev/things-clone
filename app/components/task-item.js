import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Component.extend({
  taskEditor: service(),
  taskSelector: service(),
  classNames: ['c-task', 'js-task'],
  classNameBindings: ['isSelected', 'isEditing', 'isComplete'],
  task: null,
  placeholder: 'New To-Do',
  isComplete: alias('task.isComplete'),

  isEditing: computed('taskEditor.task', function() {
    return this.taskEditor.isEditing(this.task);
  }),

  isSelected: computed('taskSelector.tasks.[]', function() {
    return this.taskSelector.isSelected(this.task);
  }),

  init() {
    this._super(...arguments);
    this.handleRootClick = this.handleRootClick.bind(this);
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
  },

  actions: {
    onEnter() {
      this.stopEditing();
    },

    onEscape() {
      this.stopEditing();
    },

    toggleTask(isComplete) {
      if (isComplete) {
        this.completeTask(this.task);
      } else {
        this.uncompleteTask(this.task);
      }
    }
  },

  mouseDown(event) {
    this.selectTask(event);
  },

  click(event) {
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
      this.taskSelector.select(this.task);
    } else {
      this.taskSelector.selectOnly(this.task);
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
      this.saveTask(this.task);
    }
  },

  startHandlingRootClick() {
    document.addEventListener('click', this.handleRootClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('click', this.handleRootClick, true);
  },

  handleRootClick(event) {
    let isInternalClick = this.element.contains(event.target);

    if (!isInternalClick) {
      this.stopEditing();
    }
  }
});
