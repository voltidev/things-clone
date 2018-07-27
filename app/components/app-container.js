import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import velocity from 'velocity-animate';
import { EKMixin, EKOnInsertMixin, keyDown, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskEditor: service(),
  taskSelector: service(),
  classNames: ['l-container'],
  isEditing: alias('taskEditor.hasTask'),

  shortcutNewTask: on(keyDown('KeyN'), function() {
    this.handleNewTask();
  }),

  shortcutEditSelected: on(keyUp('Enter'), function() {
    if (!this.taskSelector.hasTasks) {
      return;
    }

    let taskToEdit = this.taskSelector.sortedTasks.firstObject;
    this.taskEditor.edit(taskToEdit);
    this.taskSelector.selectOnly(taskToEdit);
  }),

  shortcutDeleteSelected: on(keyUp('Backspace'), function() {
    if (!this.taskSelector.hasTasks) {
      return;
    }

    let selected = document.querySelectorAll('.is-selected .js-task');
    velocity(selected, { opacity: 0 }, { duration: 100 });
    velocity(selected, { height: 0 }, { duration: 200, easing: 'easeOutCubic' }).then(() => {
      this.deleteTasks(this.taskSelector.tasks);
      this.taskSelector.clear();
    });
  }),

  shortcutSelectNext: on(keyDown('ArrowDown'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.tasks.firstObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.firstObject;
    let nextTask = this.tasks[this.tasks.indexOf(selectedTask) + 1];
    this.taskSelector.selectOnly(nextTask || selectedTask);
  }),

  shortcutSelectNextWithShift: on(keyDown('ArrowDown+shift'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.tasks.firstObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.lastObject;
    let nextTask = this.tasks[this.tasks.indexOf(selectedTask) + 1];

    if (nextTask) {
      this.taskSelector.select(nextTask);
    }
  }),

  shortcutSelecPrevious: on(keyDown('ArrowUp'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.tasks.lastObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.firstObject;
    let previousTask = this.tasks[this.tasks.indexOf(selectedTask) - 1];
    this.taskSelector.selectOnly(previousTask || selectedTask);
  }),

  shortcutSelecPreviousWithShift: on(keyDown('ArrowUp+shift'), function() {
    if (!this.taskSelector.hasTasks) {
      this.taskSelector.select(this.tasks.lastObject);
      return;
    }

    let selectedTask = this.taskSelector.sortedTasks.firstObject;
    let previousTask = this.tasks[this.tasks.indexOf(selectedTask) - 1];

    if (previousTask) {
      this.taskSelector.select(previousTask);
    }
  }),

  actions: {
    newTask() {
      return this.handleNewTask();
    }
  },

  handleNewTask() {
    this.createTask().then(newTask => {
      this.taskSelector.selectOnly(newTask);
      setTimeout(() => this.taskEditor.edit(newTask));
    });
  }
});
