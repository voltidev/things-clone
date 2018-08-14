import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  router: service(),

  model() {
    return this.get('store').findAll('task');
  },

  actions: {
    createTask() {
      let route = this.router.currentRouteName;
      let folder = route === 'today' ? 'anytime' : route;
      let isToday = route === 'today';

      let lastTask = this.get('store')
        .peekAll('task')
        .filterBy('folder', folder)
        .sortBy('order')
        .lastObject;

      let order = lastTask ? lastTask.order + 1 : 0;
      let newTask = this.store.createRecord('task', { order, folder, isToday });
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

    destroyDeleteTasks() {
      /* eslint-disable-next-line */
      if (!confirm('Are you sure you want to remove the items in the Trash permanently?')) {
        return Promise.resolve();
      }

      let deletedTasks = this.get('store')
        .peekAll('task')
        .filterBy('isDeleted', true);

      return Promise.all(deletedTasks.map(task => task.destroyRecord()));
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
