import Component from '@ember/component';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';

export default Component.extend({
  router: service(),
  isInTrashList: equal('router.currentRouteName', 'trash'),

  actions: {
    toggleIsDeleted() {
      set(this, 'task.isDeleted', !this.task.isDeleted);
    },

    moveToList(list) {
      set(this, 'task.list', list);
      set(this, 'task.isDeleted', false);
      set(this, 'task.isCompleted', false);

      if (list === 'inbox') {
        set(this, 'task.project', null);
      }
    },

    moveToProject(project) {
      set(this, 'task.project', project);

      if (this.task.list === 'inbox') {
        set(this, 'task.list', 'anytime');
      }
    }
  }
});
