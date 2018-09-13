import Route from '@ember/routing/route';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isArray } from '@ember/array';

function castArray(value = []) {
  return isArray(value) ? value : [value];
}

function uncompleteParentIfNeeded(task) {
  if (!task.isCompleted && task.get('project.isCompleted')) {
    task.get('project.content').uncomplete();
    task.get('project.content').save();
  }
}

export default Route.extend({
  data: service(),
  router: service(),

  model() {
    return {
      tasks: this.data.tasks,
      projects: this.data.projects
    };
  },

  actions: {
    replaceRoute(route) {
      this.replaceWith(route);
    },

    updateItemName(item, name) {
      set(item, 'name', name);
      item.save();
    },

    updateItemNotes(item, notes) {
      set(item, 'notes', notes);
      item.save();
    },

    completeItems(items) {
      castArray(items).forEach(item => {
        if (item.isProject) {
          item.activeTasks.forEach(task => {
            task.complete();
            task.save();
          });
        }

        item.complete();
        item.save();
      });
    },

    uncompleteItems(items) {
      castArray(items).forEach(item => {
        item.uncomplete();
        item.save();

        if (item.isTask) {
          uncompleteParentIfNeeded(item);
        }
      });
    },

    setItemsDeadline(items, deadline) {
      castArray(items).forEach(item => {
        item.set('deadline', deadline);
        item.save();
      });
    },

    reorderItems(newOrderItems) {
      newOrderItems.forEach((item, newOrder) => {
        if (item.order === newOrder) {
          return;
        }

        item.set('order', newOrder);
        item.save();
      });
    },

    deleteItems(items) {
      castArray(items).forEach(item => {
        item.delete();
        item.save();
      });
    },

    undeleteItems(items) {
      castArray(items).forEach(item => {
        item.undelete();
        item.save();

        if (item.isTask) {
          uncompleteParentIfNeeded(item);
        }
      });
    },

    destroyDeletedItems() {
      let deletedTasks = this.data.tasks.filterBy('isDeleted', true);
      let deletedProjects = this.data.projects.filterBy('isDeleted', true);
      [...deletedTasks, ...deletedProjects].forEach(item => item.destroyRecord());
    },

    moveTasksToProject(items, project) {
      castArray(items).forEach(item => {
        item.moveToProject(project);
        item.save();
      });
    },

    moveItemsToList(items, list) {
      castArray(items).forEach(item => {
        if (this.router.currentRouteName === 'trash') {
          this.send('undeleteItems', item);
        }

        if (item.isCompleted) {
          this.send('uncompleteItems', item);
        }

        item.moveToList(list);
        item.save();
      });
    },

    createTask() {
      let route = this.router.currentRouteName;
      let list = route === 'project' ? 'anytime' : route;
      let project = route === 'project'
        ? this.data.projects.findBy('id', this.router.currentURL.split('/')[2])
        : null;

      if (project && project.isCompleted && !project.isDeleted) {
        project.uncomplete();
        project.save();
      }

      let lastItem = this.data.tasks.filterBy('list', list).sortBy('order').lastObject;
      let order = lastItem ? lastItem.order + 1 : 0;
      let newItem = this.store.createRecord('task', { list, project, order });

      return newItem.save();
    },

    createProject() {
      let lastItem = this.data.projects.sortBy('order').lastObject;
      let order = lastItem ? lastItem.order + 1 : 0;
      let newItem = this.store.createRecord('project', { order });
      newItem.save().then(project => this.transitionTo('project', project));
    }
  }
});
