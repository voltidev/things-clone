import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  store: service(),
  taskEditor: service(),
  taskSelector: service(),

  actions: {
    createTask() {
      let newTask = this.store.createRecord('task');
      newTask.save();
      this.taskSelector.select(newTask);
      setTimeout(() => this.taskEditor.setCurrentTask(newTask));
    },

    saveTask(task) {
      task.save();
    },

    completeTask(task) {
      task.complete();
      task.save();
    },

    uncompleteTask(task) {
      task.uncomplete();
      task.save();
    }
  }
});
