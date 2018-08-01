import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { set } from '@ember/object';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, keyDown, keyUp } from 'ember-keyboard';
import velocity from 'velocity-animate';

function hideElements(elements) {
  velocity(elements, { opacity: 0 }, { duration: 100 });
  return velocity(elements, { height: 0 }, { duration: 200, easing: 'easeOutCubic' });
}

function fadeOutFloatedButton(parentElement) {
  let floatingBtn = parentElement.querySelector('.js-floating-button');
  let floatingBtnStyle = floatingBtn.style;

  return velocity(
    floatingBtn,
    { translateX: -100, translateY: -100, opacity: 0 },
    { duration: '200ms', easing: 'easeOutQuart' }
  ).then(() => {
    // Recover styles after animation.
    floatingBtn.style = floatingBtnStyle;
  });
}

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskSelector: service(),
  taskEditor: service(),
  classNames: ['l-container'],
  isShortcutsDialogOpen: false,
  isEditing: alias('taskEditor.hasTask'),
  hasSelected: alias('taskSelector.hasTasks'),

  shortcutNewTask: on(keyDown('KeyN'), function() {
    this.createNewTask();
  }),

  shortcutShortcutsDialog: on(keyDown('shift+Slash'), function() {
    this.toggleShortcutsDialog();
  }),

  shortcutEditSelected: on(keyUp('Enter'), function() {
    if (!this.hasSelected) {
      return;
    }

    let taskToEdit = this.taskSelector.sortedTasks.firstObject;
    this.taskEditor.edit(taskToEdit);
    this.taskSelector.selectOnly(taskToEdit);
  }),

  shortcutDeleteSelected: on(keyUp('Backspace'), function() {
    this.deleteSelected();
  }),

  actions: {
    toggleShortcutsDialog() {
      this.toggleShortcutsDialog();
    },

    createNewTask() {
      fadeOutFloatedButton(this.element);
      setTimeout(() => this.createNewTask(), 50);
    },

    editSelected() {
      if (!this.hasSelected) {
        return;
      }

      let taskToEdit = this.taskSelector.sortedTasks.firstObject;
      this.taskEditor.edit(taskToEdit);
      this.taskSelector.selectOnly(taskToEdit);
    },

    deleteSelected() {
      this.deleteSelected();
    }
  },

  toggleShortcutsDialog() {
    set(this, 'isShortcutsDialogOpen', !this.isShortcutsDialogOpen);
  },

  createNewTask() {
    this.createTask().then(newTask => {
      this.taskSelector.selectOnly(newTask);
      setTimeout(() => this.taskEditor.edit(newTask));
    });
  },

  deleteSelected() {
    if (!this.hasSelected) {
      return;
    }

    hideElements(document.querySelectorAll('.is-selected .js-task')).then(() => {
      this.deleteTasks(this.taskSelector.tasks);
      this.taskSelector.clear();
    });
  }
});
