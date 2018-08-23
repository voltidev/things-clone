import Route from '@ember/routing/route';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Route.extend({
  router: service(),

  model() {
    return RSVP.hash({
      projects: this.get('store').findAll('project'),
      tasks: this.get('store').findAll('task')
    });
  },

  actions: {
    createProject() {
      let lastItem = this.get('store')
        .peekAll('project')
        .sortBy('order')
        .lastObject;

      let order = lastItem ? lastItem.order + 1 : 0;
      let newItem = this.store.createRecord('project', { order });
      return newItem.save().then(project => this.transitionTo('project', project));
    },

    createTask() {
      let route = this.router.currentRouteName;
      let folder = route === 'project' ? 'anytime' : route;
      let project = route === 'project'
        ? this.store.peekRecord('project', this.router.currentURL.split('/')[2])
        : null;

      let lastItem = this.get('store')
        .peekAll('task')
        .filterBy('folder', folder)
        .sortBy('order')
        .lastObject;

      let order = lastItem ? lastItem.order + 1 : 0;
      let newItem = this.store.createRecord('task', { order, folder, project });
      return newItem.save();
    },

    updateTaskName(task, name) {
      set(task, 'name', name);
      return task.save().catch(() => task.rollbackAttributes());
    },

    deleteTasks(tasks) {
      return Promise.all(
        tasks.map(task => {
          task.delete();
          task.save();
        })
      );
    },

    moveTasksToProject(tasks, project) {
      return Promise.all(
        tasks.map(task => {
          task.moveToProject(project);
          task.save();
        })
      );
    },

    removeTasksFromProject(tasks) {
      return Promise.all(
        tasks.map(task => {
          task.removeFromProject();
          task.save();
        })
      );
    },

    moveTasksToFolder(tasks, folder) {
      return Promise.all(
        tasks.map(task => {
          task.moveToFolder(folder);

          if (['logbook', 'trash'].includes(this.router.currentRouteName)) {
            task.uncomplete();
            task.undelete();
          }

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
    },

    updateProjectName(project, name) {
      set(project, 'name', name);
      return project.save().catch(() => project.rollbackAttributes());
    }
  }
});
