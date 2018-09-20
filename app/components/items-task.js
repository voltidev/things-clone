import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { run } from '@ember/runloop';

export default Component.extend({
  taskEditor: service(),
  itemSelector: service(),
  router: service(),
  classNames: ['c-item', 'js-item'],
  classNameBindings: ['isCanceled', 'isSomeday', 'isEditing', 'isSelected', 'isSortable'],
  task: null,
  isEditorInitialized: false,
  placeholder: 'New To-Do',
  isCanceled: alias('task.isCanceled'),
  isSomeday: alias('task.isShownInSomeday'),
  isSortable: not('isEditing'),

  isTimeShown: computed('router.currentRouteName', function() {
    return !['logbook', 'trash'].includes(this.router.currentRouteName);
  }),

  isProjectShown: computed('router.currentRouteName', function() {
    return ['logbook', 'trash', 'today'].includes(this.router.currentRouteName);
  }),

  isEditing: computed('taskEditor.task', function() {
    return this.taskEditor.isEditing(this.task);
  }),

  isSelected: computed('itemSelector.items.[]', function() {
    return this.itemSelector.isSelected(this.task);
  }),

  init() {
    this._super(...arguments);
    this.stopEditingOnSideClick = this.stopEditingOnSideClick.bind(this);
  },

  didRender() {
    this._super(...arguments);

    if (!this.isEditing && this.isEditorInitialized) {
      this.set('isEditorInitialized', false);
      this.stopHandlingRootClick();
    }

    if (this.isEditing && !this.isEditorInitialized) {
      this.set('isEditorInitialized', true);
      this.focusInput();
      this.startHandlingRootClick();
    }
  },

  willDestroyElement() {
    this.stopHandlingRootClick();
    this.stopEditing();
    this.itemSelector.deselect(this.task);
  },

  actions: {
    stopEditing() {
      this.stopEditing();
    },

    toggleCheckbox() {
      if (this.task.isProcessed) {
        this.markItemsAs(this.task, 'new');
      } else {
        this.markItemsAs(this.task, 'completed');
      }
    }
  },

  mouseDown(event) {
    this.selectTask(event);
  },

  doubleClick() {
    this.startEditing();
  },

  onSelectOnlyItem() {
    this.itemSelector.selectOnly(this.task);
  },

  onSelectItem() {
    this.itemSelector.select(this.task);
  },

  focusInput() {
    let input = this.element.querySelector('.js-item-input');

    if (input) {
      input.focus();
    }
  },

  selectTask({ target, metaKey, shiftKey }) {
    if (target.classList.contains('js-checkbox')) {
      return;
    }

    if (shiftKey && this.itemSelector.hasItems) {
      this.itemSelector.select(this.task);
      this.selectBetween(this.element);
    } else if (metaKey) {
      this.itemSelector.toggle(this.task);
    } else {
      this.itemSelector.selectOnly(this.task);
    }
  },

  startEditing() {
    if (this.isEditing) {
      return;
    }

    this.taskEditor.edit(this.task);
  },

  stopEditing() {
    if (!this.isEditing) {
      return;
    }

    let changedAttrs = this.taskEditor.getChangedAttributes();
    let {
      name,
      notes,
      deadline,
      list,
      project,
      status,
      isDeleted
    } = this.taskEditor.task;

    let isProjectChanged = get(this, 'task.project.id') !== get(this, 'taskEditor.task.project.id');

    if (changedAttrs.includes('name')) {
      this.updateItemName(this.task, name);
    }

    if (changedAttrs.includes('notes')) {
      this.updateItemNotes(this.task, notes);
    }

    if (changedAttrs.includes('deadline')) {
      this.setItemsDeadline(this.task, deadline);
    }

    if (changedAttrs.includes('list')) {
      this.moveItemsToList(this.task, list);
    }

    if (isProjectChanged) {
      this.moveTasksToProject(this.task, project);
    }

    if (changedAttrs.includes('status')) {
      this.markItemsAs(this.task, status);
    }

    if (changedAttrs.includes('isDeleted')) {
      (isDeleted ? this.deleteItems : this.undeleteItems)(this.task);
    }

    this.taskEditor.clear();
  },

  startHandlingRootClick() {
    document.addEventListener('mousedown', this.stopEditingOnSideClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('mousedown', this.stopEditingOnSideClick, true);
  },

  stopEditingOnSideClick({ target }) {
    run(() => {
      let isInternalClick = this.element.contains(target);
      let isItemsActions = [...document.querySelectorAll('.js-items-actions')].some(el => el.contains(target));

      if (!isInternalClick && !isItemsActions) {
        this.stopEditing();
      }
    });
  }
});
