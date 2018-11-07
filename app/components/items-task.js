import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, not, or } from '@ember/object/computed';
import { run } from '@ember/runloop';

export default Component.extend({
  taskEditor: service(),
  itemSelector: service(),
  router: service(),
  classNames: ['c-item', 'js-item'],
  classNameBindings: ['isCanceled', 'isSomeday', 'isEditing', 'isSelected', 'isSortable'],
  task: null,
  placeholder: 'New To-Do',
  isCanceled: alias('task.isCanceled'),
  isSomeday: or('task.isShownInSomeday', 'task.isShownInProjectSomeday'),
  isSortable: not('isEditing'),

  isProjectShown: computed('router.currentRouteName', function() {
    return ['logbook', 'trash', 'today'].includes(this.router.currentRouteName);
  }),

  isEditing: computed('taskEditor.task', function() {
    return this.taskEditor.isEditing(this.task);
  }),

  isSelected: computed('itemSelector.items.[]', function() {
    return this.itemSelector.isSelected(this.task);
  }),

  willDestroyElement() {
    this._super(...arguments);
    this.stopEditing();
    // TODO:
    // Find a way to only deselect items that are not on the screen anymore.
    // run.next is preventing `Backtracking re-render` bug.
    run.next(() => this.itemSelector.deselect(this.task));
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

    this.updateTask(this.task, this.taskEditor.task);
    this.taskEditor.clear();
  }
});
