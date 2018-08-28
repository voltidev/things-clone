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

    async updateItemName(item, name) {
      set(item, 'name', name);
      await item.save();
    },

    async completeItem(item) {
      if (item.isProject) {
        await this.completeProject(item);
      } else {
        item.complete();
        await item.save();        
      }
    },

    async uncompleteItem(item) {
      if (item.isTask) {
        await this.uncompleteTask(item);
      } else {
        item.uncomplete();
        await item.save();
      }
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
      if (item.isProject) {
        return this.deleteProject(item);
      }

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

    async undeleteItem(item) {
      if (item.isTask) {
        await this.undeleteTask(item);
      } else {
        item.undelete();
        await item.save();
      }
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

      if (project && project.isCompleted && !project.isDeleted) {
        project.uncomplete();
      }

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

    async moveTasksToFolder(tasks, folder) {
      await Promise.all(
        tasks.map(async task => {
          task.moveToFolder(folder);

          if (this.router.currentRouteName === 'trash') {
            await this.undeleteTask(task);
          }

          if (task.isCompleted) {
            await this.uncompleteTask(task);
          }

          if (task.hasDirtyAttributes) {
            await task.save();
          }
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
  },

  completeProject(project) {
    /* eslint-disable-next-line */
    if (!confirm('Are you sure you want to complete this project?')) {
      return Promise.resolve();
    }

    project.complete();
    let activeTasks = project.tasks.filter(task => !task.isDeleted && !task.isCompleted);

    return project.save().then(() => {
      activeTasks.forEach(task => task.complete());
      return Promise.all(activeTasks.map(task => task.save()));
    });
  },

  deleteProject(project) {
    project.delete();
    let todayTasks = project.tasks.filter(task => task.isToday);

    return project.save().then(() => {
      todayTasks.forEach(task => task.unstar());
      return Promise.all(todayTasks.map(task => task.save()));
    });
  },

  async uncompleteTask(task) {
    task.uncomplete();
    await task.save();

    if (task.get('project.isCompleted')) {
      task.get('project.content').uncomplete();
      await task.get('project.content').save();
    }
  },

  async undeleteTask(task) {
    task.undelete();
    await task.save();

    if (!task.isCompleted && task.get('project.isCompleted')) {
      task.get('project.content').uncomplete();
      await task.get('project.content').save();
    }
  }
});
