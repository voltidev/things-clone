import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskSelector: service(),
  taskEditor: service(),
  isShortcutsDialogOpen: false,

  shortcutNewTask: on(keyDown('KeyN'), function() {
    this.createTask().then(newTask => {
      this.taskSelector.selectOnly(newTask);
      setTimeout(() => this.taskEditor.edit(newTask));
    });
  }),

  shortcutShortcutsDialog: on(keyDown('shift+Slash'), function() {
    this.toggleShortcutsDialog();
  }),

  actions: {
    showShortcutsDialog() {
      set(this, 'isShortcutsDialogOpen', true);
    },

    toggleShortcutsDialog() {
      this.toggleShortcutsDialog();
    }
  },

  toggleShortcutsDialog() {
    set(this, 'isShortcutsDialogOpen', !this.isShortcutsDialogOpen);
  }
});
