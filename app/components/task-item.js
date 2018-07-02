import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  taskEditor: service(),
  classNames: ['c-task'],
  classNameBindings: ['isEditable'],
  task: null,

  isEditable: computed('taskEditor.currentTask', function() {
    return this.taskEditor.isCurrent(this.task);
  }),

  actions: {
    onEnter() {
      this.taskEditor.setCurrentTask(null);
    }
  }
});
