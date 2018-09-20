import Route from '@ember/routing/route';
import { set } from '@ember/object';
import { inject as service } from '@ember/service';
import { isArray, A } from '@ember/array';
import { timeout } from 'ember-concurrency';

function castArray(value = []) {
  return isArray(value) ? value : [value];
}

export default Route.extend({
  data: service(),
  router: service(),
  savingProcesses: A(),

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
      this.save(item);
    },

    updateItemNotes(item, notes) {
      set(item, 'notes', notes);
      this.save(item);
    },

    completeItems(items) {
      castArray(items).forEach(item => {
        if (item.isProject) {
          item.activeTasks.forEach(task => {
            task.complete();
            this.save(task);
          });
        }

        item.complete();
        this.save(item);
      });
    },

    uncompleteItems(items) {
      castArray(items).forEach(item => {
        item.uncomplete();
        this.save(item);

        if (item.isTask) {
          this.updateProjectIfNeeded(item);
        }
      });
    },

    cancelItems(items) {
      castArray(items).forEach(item => {
        if (item.isProject) {
          item.activeTasks.forEach(task => {
            task.cancel();
            this.save(task);
          });
        }

        item.cancel();
        this.save(item);
      });
    },

    setItemsDeadline(items, deadline) {
      castArray(items).forEach(item => {
        item.set('deadline', deadline);
        this.save(item);
      });
    },

    reorderItems(newOrderItems) {
      newOrderItems.forEach((item, newOrder) => {
        if (item.order === newOrder) {
          return;
        }

        item.set('order', newOrder);
        this.save(item);
      });
    },

    deleteItems(items) {
      castArray(items).forEach(item => {
        item.delete();
        this.save(item);
      });
    },

    undeleteItems(items) {
      castArray(items).forEach(item => {
        item.undelete();
        this.save(item);

        if (item.isTask) {
          this.updateProjectIfNeeded(item);
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
        this.save(item);
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
        this.save(item);
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
        this.save(project);
      }

      let lastItem = this.data.tasks.filterBy('list', list).sortBy('order').lastObject;
      let order = lastItem ? lastItem.order + 1 : 0;
      let task = this.store.createRecord('task', { list, project, order });
      this.save(task);

      return task;
    },

    createProject() {
      let lastItem = this.data.projects.sortBy('order').lastObject;
      let order = lastItem ? lastItem.order + 1 : 0;
      let project = this.store.createRecord('project', { order });
      this.save(project);
      this.transitionTo('project', project);
    }
  },

  updateProjectIfNeeded(task) {
    let project = task.get('project.content');

    if (!project) {
      return;
    }

    if ((!task.isProcessed) && project.isProcessed) {
      project.uncomplete();
      this.save(project);
    }
  },

  save(item) {
    let currentProcess = this.savingProcesses.find(process => process.item === item);

    if (currentProcess) {
      return currentProcess.promise;
    }

    let promise = timeout(300);
    let newProcess = { item, promise };
    this.savingProcesses.addObject(newProcess);

    return promise.then(() => {
      this.savingProcesses.removeObject(newProcess);
      return item.save();
    });
  }
});
