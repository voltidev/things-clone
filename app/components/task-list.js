import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import { EKMixin, EKOnInsertMixin, keyDown, keyUp } from 'ember-keyboard';
import velocity from 'velocity-animate';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskEditor: service(),
  taskSelector: service(),
  model: null,
  isEditing: alias('taskEditor.hasTask'),

  shortcutNewTask: on(keyDown('KeyN'), function() {
    this.createTask().then(newTask => {
      this.taskSelector.selectOnly(newTask);
      setTimeout(() => this.taskEditor.edit(newTask));
    });
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
    selectBetween(clickedTask) {
      this.taskSelector.select(clickedTask);
      let selectedTasks = this.taskSelector.sortedTasks;
      let firstTask = selectedTasks.firstObject;
      let lastTask = clickedTask !== firstTask ? clickedTask : selectedTasks.lastObject;

      this.taskSelector.selectOnly(
        ...this.tasks.filter(({ order }) => order >= firstTask.order && order <= lastTask.order)
      );
    }
  }
});
