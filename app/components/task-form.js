import Component from '@ember/component';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { equal, or } from '@ember/object/computed';

export default Component.extend({
  router: service(),
  isInTrashList: equal('router.currentRouteName', 'trash'),
  isCompleted: equal('task.status', 'completed'),
  isCanceled: equal('task.status', 'canceled'),
  isProcessed: or('isCompleted', 'isCanceled'),

  actions: {
    toggleIsDeleted() {
      set(this, 'task.isDeleted', !this.task.isDeleted);
    },

    setWhen(whenList, date) {
      set(this, 'task.list', whenList);
      set(this, 'task.upcomingAt', date);
      set(this, 'task.isDeleted', false);
      set(this, 'task.status', 'new');
    },

    moveToInbox() {
      set(this, 'task.list', 'inbox');
      set(this, 'task.project', null);
    },

    moveToProject(project) {
      set(this, 'task.project', project);

      if (this.task.list === 'inbox') {
        set(this, 'task.list', 'anytime');
      }
    },

    toggleCheckbox() {
      let newStatus = this.isProcessed ? 'new' : 'completed';
      set(this, 'task.status', newStatus);
    }
  }
});
