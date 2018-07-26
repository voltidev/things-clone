import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import { run } from '@ember/runloop';
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

    let selected = document.querySelector('.js-task.is-selected');
    velocity(selected, { opacity: 0 }, { duration: 100 });
    velocity(selected, { height: 0 }, { duration: 200, easing: 'easeOutCubic' }).then(
      run(() => {
        this.deleteTasks(this.taskSelector.tasks);
        this.taskSelector.clear();
      })
    );
  }),

  shortcutSelectNext: on(keyDown('ArrowDown'), function() {
    if (!this.taskSelector.hasTasks) {
      return;
    }

    let next = document.querySelector('.js-task.is-selected').parentElement.nextElementSibling;

    if (next) {
      next.firstElementChild.click();
    }
  }),

  shortcutSelecPrevious: on(keyDown('ArrowUp'), function() {
    if (!this.taskSelector.hasTasks) {
      return;
    }

    let previous = document.querySelector('.js-task.is-selected').parentElement
      .previousElementSibling;

    if (previous) {
      previous.firstElementChild.click();
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
