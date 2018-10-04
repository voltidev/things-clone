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
      projects: this.data.projects,
      tags: this.data.tags
    };
  },

  actions: {
    replaceRoute(route) {
      this.replaceWith(route);
    },

    setItemName(item, name) {
      set(item, 'name', name);
      this.save(item);
    },

    setItemNotes(item, notes) {
      set(item, 'notes', notes);
      this.save(item);
    },

    markItemsAs(items, status, childrenStatus) {
      castArray(items).forEach(item => {
        item.markAs(status);
        this.save(item);

        if (item.isTask && status === 'new') {
          this.setProjectIfNeeded(item);
        }

        if (item.isProject && status !== 'new') {
          item.activeTasks.forEach(task => {
            task.markAs(childrenStatus || status);
            this.save(task);
          });
        }
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
          this.setProjectIfNeeded(item);
        }
      });
    },

    destroyDeletedItems() {
      this.data.tasks
        .filterBy('isDeleted', true)
        .forEach(task => task.destroyRecord());

      this.data.projects
        .filterBy('isDeleted', true)
        .forEach(async project => {
          let childTasks = (project.hasMany('tasks').value() || []).toArray();
          await project.destroyRecord();
          childTasks.forEach(task => task.destroyRecord());
        });
    },

    setItemsWhen(items, when, date) {
      castArray(items).forEach(item => {
        if (this.router.currentRouteName === 'trash') {
          this.send('undeleteItems', item);
        }

        if (item.isCompleted) {
          this.send('markItemsAs', item, 'new');
        }

        item.setWhen(when, date);
        this.save(item);
      });
    },

    addItemTag(item, tag) {
      let projectsOrTasks = item.isProject ? 'projects' : 'tasks';
      tag.get(projectsOrTasks).pushObject(item);
      this.save(tag);
    },

    removeItemTag(item, tag) {
      let projectsOrTasks = item.isProject ? 'projects' : 'tasks';
      tag.get(projectsOrTasks).removeObject(item);
      this.save(tag);
    },

    seTaskSubtasks(item, subtasks) {
      item.setSubtasks(subtasks);
      this.save(item);
    },

    moveTasksToInbox(items) {
      castArray(items).forEach(item => {
        item.moveToInbox();
        this.save(item);
      });
    },

    moveTasksToProject(items, project) {
      castArray(items).forEach(item => {
        item.moveToProject(project);
        this.save(item);
      });
    },

    createTask() {
      let route = this.router.currentRouteName;
      let isInbox = route === 'inbox';
      let when = 'anytime';
      let project = null;

      if (['today', 'someday'].includes(route)) {
        when = route;
      }

      if (route === 'project') {
        project = this.data.projects.findBy('id', this.router.currentURL.split('/')[2]);
      }

      if (project && project.isCompleted && !project.isDeleted) {
        project.markAs('new');
        this.save(project);
      }

      let lastItem = this.data.tasks.sortBy('order').lastObject;
      let order = lastItem ? lastItem.order + 1 : 0;

      let task = this.store.createRecord('task', { isInbox, when, project, order });
      this.save(task);
      return task;
    },

    createProject() {
      let lastItem = this.data.projects.sortBy('order').lastObject;
      let order = lastItem ? lastItem.order + 1 : 0;
      let project = this.store.createRecord('project', { order });
      this.save(project);
      this.transitionTo('project', project);
    },

    createTag(name) {
      let tag = this.store.createRecord('tag', { name });
      this.save(tag);
      return tag;
    },

    setTagName(name, tag) {
      set(tag, 'name', name);
    },

    deleteTag(tag) {
      tag.delete();
      this.save(tag);
    }
  },

  setProjectIfNeeded(task) {
    let project = task.get('project.content');

    if (!project) {
      return;
    }

    if ((!task.isProcessed) && project.isProcessed) {
      project.markAs('new');
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
