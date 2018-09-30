import Component from '@ember/component';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { equal, or } from '@ember/object/computed';
import { run } from '@ember/runloop';
import OutsideClickMixin from 'things/mixins/outside-click';

export default Component.extend(OutsideClickMixin, {
  router: service(),
  isInTrashList: equal('router.currentRouteName', 'trash'),
  isCompleted: equal('task.status', 'completed'),
  isCanceled: equal('task.status', 'canceled'),
  isProcessed: or('isCompleted', 'isCanceled'),

  didInsertElement() {
    this._super(...arguments);
    this.focusInput();
  },

  actions: {
    toggleIsDeleted() {
      set(this, 'task.isDeleted', !this.task.isDeleted);
    },

    setWhen(when, date) {
      set(this, 'task.when', when);
      set(this, 'task.upcomingAt', date);
      set(this, 'task.isInbox', false);

      if (this.router.currentRouteName === 'trash') {
        set(this, 'task.isDeleted', false);
      }

      if (this.router.currentRouteName === 'logbook') {
        set(this, 'task.status', 'new');
      }
    },

    moveToInbox() {
      set(this, 'task.isInbox', true);
      set(this, 'task.project', null);
    },

    moveToProject(project) {
      set(this, 'task.project', project);
      set(this, 'task.isInbox', false);
    },

    toggleCheckbox() {
      let newStatus = this.isProcessed ? 'new' : 'completed';
      set(this, 'task.status', newStatus);
    }
  },

  outsideClick({ target }) {
    let isItemsActions = [...document.querySelectorAll('.js-items-actions')]
      .some(el => el.contains(target));

    if (!isItemsActions) {
      this.stopEditing();
    }
  },

  focusInput() {
    run.next(() => {
      let input = this.element.querySelector('.js-input');

      if (input) {
        input.focus();
      }
    });
  }
});
