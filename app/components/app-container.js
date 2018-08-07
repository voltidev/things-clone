import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { set, computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, keyDown, keyUp } from 'ember-keyboard';
import move from 'ember-animated/motions/move';
import { easeOut, easeIn } from 'ember-animated/easings/cosine';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  router: service(),
  taskSelector: service(),
  taskEditor: service(),
  classNames: ['l-container'],
  isShortcutsDialogOpen: false,
  isEditing: alias('taskEditor.hasTask'),
  hasSelected: alias('taskSelector.hasTasks'),

  canCreateTask: computed('router.currentRouteName', 'isEditing', function() {
    return !this.isEditing && !['logbook'].includes(this.router.currentRouteName);
  }),

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
      this.createNewTask();
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
    if (!this.canCreateTask) {
      return;
    }

    this.createTask().then(newTask => {
      this.taskSelector.selectOnly(newTask);
      setTimeout(() => this.taskEditor.edit(newTask));
    });
  },

  deleteSelected() {
    if (!this.hasSelected) {
      return;
    }

    this.deleteTasks(this.taskSelector.tasks);
    this.taskSelector.clear();
  },

  * transition({ insertedSprites, removedSprites }) {
    insertedSprites.forEach(sprite => {
      sprite.startAtPixel({ y: window.innerHeight });
      move(sprite, { easing: easeOut });
    });

    removedSprites.forEach(sprite => {
      sprite.endAtPixel({ y: window.innerHeight });
      move(sprite, { easing: easeIn });
    });
  }
});
