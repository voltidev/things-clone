import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.get('store').findAll('task');
  },

  actions: {
    createTask(tasks) {
      let order = tasks.lastObject ? tasks.lastObject.order + 1 : 0;
      let newTask = this.store.createRecord('task', { order });
      return newTask.save();
    },

    saveTask(task) {
      return task.save();
    },

    deleteTasks(tasks) {
      return Promise.all(
        tasks.map(task => {
          task.delete();
          task.save();
        })
      );
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
