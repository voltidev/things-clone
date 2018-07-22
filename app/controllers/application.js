import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  store: service(),
  taskEditor: service(),
  taskSelector: service(),

  tasks: computed('model.@each.order', function() {
    return this.model.sortBy('order');
  }),

  actions: {
    createTask() {
      let order = this.tasks.lastObject ? this.tasks.lastObject.order + 1 : 0;
      let newTask = this.store.createRecord('task', { order });
      newTask.save();
      this.taskSelector.selectOnly(newTask);
      setTimeout(() => this.taskEditor.edit(newTask));
    },

    saveTask(task) {
      task.save();
    },

    deletetasks() {
      if (this.taskSelector.hasTasks) {
        this.taskSelector.tasks.forEach(task => task.destroyRecord());
        this.taskSelector.clear();
      }
    },

    reorderTasks(newOrdertasks) {
      newOrdertasks.forEach((task, index) => {
        if (task.order !== index) {
          task.set('order', index);
          task.save();
        }
      });
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
