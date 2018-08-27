import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { on } from '@ember/object/evented';
import { run, scheduleOnce } from '@ember/runloop';
import { EKMixin, EKOnInsertMixin, keyDown, keyUp } from 'ember-keyboard';
import fade from 'ember-animated/transitions/fade';

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

export default Component.extend(EKMixin, EKOnInsertMixin, {
  router: service(),
  itemSelector: service(),
  taskEditor: service(),
  classNames: ['l-container__content', 'c-folder'],
  fade,
  titleInputPlaceholder: 'New project',
  hasSelected: alias('itemSelector.hasItems'),

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

  init() {
    this._super(...arguments);
    this.deselectAllOnSideClick = this.deselectAllOnSideClick.bind(this);
  },

  didRender() {
    this._super(...arguments);
    this.startHandlingRootClick();

    if (this.project && !this.project.name) {
      this.focusTitleInput();
    }
  },

  willDestroyElement() {
    this.stopHandlingRootClick();
  },

  actions: {
    blurTitleInput() {
      let input = this.element.querySelector('.js-title-input');

      if (input) {
        input.blur();
      }
    },

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

  deselectAllOnSideClick({ target }) {
    run(() => {
      if (!this.hasSelected) {
        return;
      }

      let isInternalClick = this.element.contains(target);
      let actionsBarEl = document.querySelector('.js-actions-bar');
      let isActionsBar = actionsBarEl && actionsBarEl.contains(target);
      let moveDialogEl = document.querySelector('.js-move-dialog');
      let isMoveDialog = moveDialogEl && moveDialogEl.contains(target);

      if (!isInternalClick && !isActionsBar && !isMoveDialog) {
        this.itemSelector.clear();
      }
    });
  },

  startHandlingRootClick() {
    document.addEventListener('mousedown', this.deselectAllOnSideClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('mousedown', this.deselectAllOnSideClick, true);
  },

  focusTitleInput() {
    let input = this.element.querySelector('.js-title-input');

    if (input) {
      input.focus();
    }
  }
});
