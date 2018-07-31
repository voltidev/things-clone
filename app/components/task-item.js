import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';
import velocity from 'velocity-animate';

function hideElement(element) {
  velocity(element, { opacity: 0 }, { duration: 100 });
  return velocity(element, { height: 0 }, { duration: 200, easing: 'easeOutCubic' });
}

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
  },

  actions: {
    onEnter() {
      this.stopEditing();
    },

    onEscape() {
      this.stopEditing();
    },

    toggleTask(isCompleted) {
      if (isCompleted) {
        this.waitAndCompleteTask.perform();
      } else {
        this.waitAndCompleteTask.cancelAll();
        this.uncompleteTask(this.task);
      }
    }
  },

  waitAndCompleteTask: task(function* () {
    yield timeout(1500);
    this.stopEditing();
    this.taskSelector.deselect(this.task);
    hideElement(this.element).then(() => this.completeTask(this.task));
  }),

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
