import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { task, timeout } from 'ember-concurrency';
import config from 'things/config/environment';

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

    toggleTask(isChecked) {
      if (isChecked) {
        this.completeTask(this.task);

        if (!this.isEditing) {
          this.waitAndHideTask.perform();
        }
      } else {
        this.waitAndHideTask.cancelAll();
        this.uncompleteTask(this.task);
      }
    }
  },

  waitAndHideTask: task(function* () {
    yield timeout(config.isTest ? 0 : 1500);
    this.taskSelector.deselect(this.task);
    this.removeFromList(this.task);
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
    if (this.isEditing) {
      return;
    }

    this.waitAndHideTask.cancelAll();
    this.taskEditor.edit(this.task);
  },

  stopEditing() {
    if (!this.isEditing) {
      return;
    }

    if (this.isCompleted) {
      this.waitAndHideTask.perform();
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
