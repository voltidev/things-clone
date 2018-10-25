import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, not } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { scheduleOnce } from '@ember/runloop';
import { EKMixin, keyDown, keyUp } from 'ember-keyboard';
import fade from 'ember-animated/transitions/fade';
import OutsideClickMixin from 'things/mixins/outside-click';

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function selectOnlyElement(element) {
  if (!element) {
    return;
  }

  element.dispatchEvent(new CustomEvent('selectonlyitem', { bubbles: true }));
}

function selectElement(element) {
  if (!element) {
    return;
  }

  element.dispatchEvent(new CustomEvent('selectitem', { bubbles: true }));
}

export default Component.extend(EKMixin, OutsideClickMixin, {
  router: service(),
  data: service(),
  itemSelector: service(),
  taskEditor: service(),

  classNames: ['l-container__content', 'c-folder'],
  fade,
  hasSelected: alias('itemSelector.hasItems'),
  isEditing: alias('taskEditor.hasTask'),
  keyboardActivated: not('isEditing'),
  routeName: alias('router.currentRouteName'),

  tagsForProject: computed(
    'project',
    'project.tasks.[]',
    'project.tasks.@each.{tags,isShownInProjectAnytime,isShownInProjectUpcoming,isShownInProjectSomeday,isShownInProjectLogbook}',
    function() {
      return this.project.tasks
        .filter(task => (
          task.isShownInProjectAnytime
          || task.isShownInProjectUpcoming
          || task.isShownInProjectSomeday
          || task.isShownInProjectLogbook
        ))
        .reduce((tags, task) => tags.addObjects(task.tags.toArray()), []);
    }
  ),

  tagsForList: computed(
    'routeName',
    'data.tags.[]',
    'data.tags.@each.{isShownInInbox,isShownInToday,isShownInUpcoming,isShownInAnytime,isShownInSomeday}',
    function() {
      return this.data.tags.filterBy(`isShownIn${capitalize(this.routeName)}`, true);
    }
  ),

  tags: computed('project', 'tagsForProject', 'tagsForList', function() {
    return this.project ? this.tagsForProject : this.tagsForList;
  }),

  shortcutEditSelected: on(keyUp('Enter'), function() {
    if (!this.hasSelected) {
      return;
    }

    let item = this.itemSelector.items.lastObject;

    if (item.isProject) {
      this.router.transitionTo('project', item);
      return;
    }

    this.taskEditor.edit(item);
    this.itemSelector.selectOnly(item);
  }),

  shortcutSelectNext: on(keyDown('ArrowDown'), function() {
    let allElements = [...document.querySelectorAll('.js-item')];

    if (!this.itemSelector.hasItems) {
      selectOnlyElement(allElements.firstObject);
      return;
    }

    let lastSelectedElement = [...document.querySelectorAll('.js-item.is-selected')].lastObject;
    let nextElement = allElements[allElements.indexOf(lastSelectedElement) + 1];
    selectOnlyElement(nextElement || lastSelectedElement);
  }),

  shortcutSelectNextWithShift: on(keyDown('ArrowDown+shift'), function() {
    let allElements = [...document.querySelectorAll('.js-item')];

    if (!this.itemSelector.hasItems) {
      selectOnlyElement(allElements.firstObject);
      return;
    }

    let lastSelectedElement = [...document.querySelectorAll('.js-item.is-selected')].lastObject;
    let nextElement = allElements[allElements.indexOf(lastSelectedElement) + 1];

    if (nextElement) {
      selectElement(nextElement);
    }
  }),

  shortcutSelecPrevious: on(keyDown('ArrowUp'), function() {
    let allElements = [...document.querySelectorAll('.js-item')];

    if (!this.itemSelector.hasItems) {
      selectOnlyElement(allElements.lastObject);
      return;
    }

    let firstSelectedElement = document.querySelector('.js-item.is-selected');
    let previousElement = allElements[allElements.indexOf(firstSelectedElement) - 1];
    selectOnlyElement(previousElement || firstSelectedElement);
  }),

  shortcutSelecPreviousWithShift: on(keyDown('ArrowUp+shift'), function() {
    let allElements = [...document.querySelectorAll('.js-item')];

    if (!this.itemSelector.hasItems) {
      selectOnlyElement(allElements.lastObject);
      return;
    }

    let firstSelectedElement = document.querySelector('.js-item.is-selected');
    let previousElement = allElements[allElements.indexOf(firstSelectedElement) - 1];

    if (previousElement) {
      selectElement(previousElement);
    }
  }),

  actions: {
    selectBetween(clickedElement) {
      scheduleOnce('afterRender', this, this.handleSelectBetween, clickedElement);
    }
  },

  handleSelectBetween(clickedElement) {
    let allElements = [...document.querySelectorAll('.js-item')];
    let selectedElements = [...document.querySelectorAll('.js-item.is-selected')];
    let firstSelectedElement = selectedElements.firstObject;
    let lastSelectedElement = clickedElement === firstSelectedElement
      ? selectedElements.lastObject
      : clickedElement;

    let firstElementIndex = allElements.indexOf(firstSelectedElement);
    let lastElementIndex = allElements.indexOf(lastSelectedElement);

    this.itemSelector.clear();
    allElements
      .filter((_, index) => index >= firstElementIndex && index <= lastElementIndex)
      .forEach(element => selectElement(element));
  },

  outsideClick({ target }) {
    if (!this.hasSelected) {
      return;
    }

    let isItemsAction = [...document.querySelectorAll('.js-items-actions')]
      .some(el => el.contains(target));

    if (!isItemsAction) {
      this.itemSelector.clear();
    }
  }
});
