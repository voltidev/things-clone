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
    replaceRoute(route) {
      this.replaceWith(route);
    },

    updateItemName(item, name) {
      set(item, 'name', name);
      return item.save().catch(() => item.rollbackAttributes());
    },

    completeItem(item) {
      item.complete();
      return item.save();
    },

    uncompleteItem(item) {
      item.uncomplete();
      return item.save();
    },

    reorderItems(newOrderItems) {
      let promises = newOrderItems.reduce((saved, item, newOrder) => {
        if (item.order !== newOrder) {
          item.set('order', newOrder);
          saved.push(item.save());
        }
        return saved;
      }, []);

      return Promise.all(promises);
    },

    deleteItem(item) {
      item.delete();
      return item.save();
    },

    deleteItems(tasks) {
      return Promise.all(
        tasks.map(task => {
          task.delete();
          return task.save();
        })
      );
    },

    undeleteItem(item) {
      item.undelete();
      return item.save();
    },

    destroyDeletedItems() {
      /* eslint-disable-next-line */
      if (!confirm('Are you sure you want to remove the items in the Trash permanently?')) {
        return Promise.resolve();
      }

      let deletedTasks = this.get('store')
        .peekAll('task')
        .filterBy('isDeleted', true);

      let deletedProjects = this.get('store')
        .peekAll('project')
        .filterBy('isDeleted', true);

      let deletedItems = [...deletedTasks, ...deletedProjects];

      return Promise.all(deletedItems.map(item => item.destroyRecord()));
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

    moveTasksToProject(tasks, project) {
      return Promise.all(
        tasks.map(task => {
          task.moveToProject(project);
          return task.save();
        })
      );
    },

    removeTasksFromProject(tasks) {
      return Promise.all(
        tasks.map(task => {
          task.removeFromProject();
          return task.save();
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

          return task.save();
        })
      );
    },

    createProject() {
      let lastItem = this.get('store')
        .peekAll('project')
        .sortBy('order')
        .lastObject;

      let order = lastItem ? lastItem.order + 1 : 0;
      let newItem = this.store.createRecord('project', { order });
      return newItem.save().then(project => this.transitionTo('project', project));
    }
  }
});
