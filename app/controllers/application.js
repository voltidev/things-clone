import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Controller.extend({
  store: service(),

  tasks: computed('model.@each.order', function() {
    return this.model.sortBy('order');
  }),

  actions: {
    createTask() {
      let order = this.tasks.lastObject ? this.tasks.lastObject.order + 1 : 0;
      let newTask = this.store.createRecord('task', { order });
      return newTask.save();
    },

    saveTask(task) {
      return task.save();
    },

    deleteTasks(tasks) {
      return Promise.all(tasks.map(task => task.destroyRecord()));
    },

    reorderTasks(newOrderTasks) {
      let promises = newOrderTasks.reduce((saved, task, newOrder) => {
        if (task.order !== newOrder) {
          task.set('order', newOrder);
          saved.push(task.save());
        }
        return saved;
      }, []);

      return Promise.all(promises);
    },

    completeTask(task) {
      task.complete();
      return task.save();
    },

    uncompleteTask(task) {
      task.uncomplete();
      return task.save();
    }
  }
});
