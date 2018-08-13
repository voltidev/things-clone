import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias, notEmpty } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { EKMixin, EKOnInsertMixin, keyDown, keyUp } from 'ember-keyboard';
import fade from 'ember-animated/transitions/fade';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskSelector: service(),
  taskEditor: service(),
  classNames: ['l-container__content', 'c-folder'],
  fade,
  hasSelected: alias('taskSelector.hasTasks'),
  hasItems: notEmpty('items'),

  shortcutEditSelected: on(keyUp('Enter'), function() {
    if (!this.hasSelected) {
      return;
    }

    let taskToEdit = this.taskSelector.tasks.lastObject;
    this.taskEditor.edit(taskToEdit);
    this.taskSelector.selectOnly(taskToEdit);
  }),

  shortcutSelectNext: on(keyDown('ArrowDown'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.items.firstObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.firstObject;
    let nextTask = this.items[this.items.indexOf(selectedTask) + 1];
    this.taskSelector.selectOnly(nextTask || selectedTask);
  }),

  shortcutSelectNextWithShift: on(keyDown('ArrowDown+shift'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.items.firstObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.lastObject;
    let nextTask = this.items[this.items.indexOf(selectedTask) + 1];

    if (nextTask) {
      this.taskSelector.select(nextTask);
    }
  }),

  shortcutSelecPrevious: on(keyDown('ArrowUp'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.items.lastObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.firstObject;
    let previousTask = this.items[this.items.indexOf(selectedTask) - 1];
    this.taskSelector.selectOnly(previousTask || selectedTask);
  }),

  shortcutSelecPreviousWithShift: on(keyDown('ArrowUp+shift'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.items.lastObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.firstObject;
    let previousTask = this.items[this.items.indexOf(selectedTask) - 1];

    if (previousTask) {
      this.taskSelector.select(previousTask);
    }
  }),

  init() {
    this._super(...arguments);
    this.deselectAllOnSideClick = this.deselectAllOnSideClick.bind(this);
  },

  didRender() {
    this._super(...arguments);
    this.startHandlingRootClick();
  },

  willDestroyElement() {
    this.stopHandlingRootClick();
  },

  actions: {
    selectBetween(clickedTask) {
      this.taskSelector.select(clickedTask);
      let selectedTasks = this.taskSelector.sortedTasks;
      let firstTask = selectedTasks.firstObject;
      let lastTask = clickedTask !== firstTask ? clickedTask : selectedTasks.lastObject;

      this.taskSelector.selectOnly(
        ...this.items.filter(({ order }) => order >= firstTask.order && order <= lastTask.order)
      );
    }
  },

  deselectAllOnSideClick({ target }) {
    run(() => {
      let isInternalClick = this.element.contains(target);
      let actionsBarEl = document.querySelector('.js-actions-bar');
      let isActionsBar = actionsBarEl && actionsBarEl.contains(target);

      if (!isInternalClick && !isActionsBar) {
        this.taskSelector.clear();
      }
    });
  },

  startHandlingRootClick() {
    document.addEventListener('mousedown', this.deselectAllOnSideClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('mousedown', this.deselectAllOnSideClick, true);
  }
});
