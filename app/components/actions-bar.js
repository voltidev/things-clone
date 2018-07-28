import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  taskEditor: service(),
  taskSelector: service(),
  classNames: ['c-actions-bar'],

  actions: {
    newTask() {
      this.createTask().then(newTask => {
        this.taskSelector.selectOnly(newTask);
        setTimeout(() => this.taskEditor.edit(newTask));
      });
    }
  }
});
