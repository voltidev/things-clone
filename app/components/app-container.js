import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { set } from '@ember/object';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';
import velocity from 'velocity-animate';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskSelector: service(),
  taskEditor: service(),
  classNames: ['l-container'],
  isShortcutsDialogOpen: false,
  isEditing: alias('taskEditor.hasTask'),

  shortcutNewTask: on(keyDown('KeyN'), function() {
    this.createNewTask();
  }),

  shortcutShortcutsDialog: on(keyDown('shift+Slash'), function() {
    this.toggleShortcutsDialog();
  }),

  actions: {
    createNewTask() {
      let element = this.element.querySelector('.js-floating-button');
      velocity(
        element,
        { translateX: -100, translateY: -100, opacity: 0 },
        { duration: '200ms', easing: 'easeOutQuart' }
      );
      velocity(element, { translateX: 0, translateY: 0, opacity: 1 });

      setTimeout(() => this.createNewTask(), 50);
    },

    toggleShortcutsDialog() {
      this.toggleShortcutsDialog();
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
  }
});
