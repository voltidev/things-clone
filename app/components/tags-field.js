import Component from '@ember/component';
import { set, computed } from '@ember/object';
import { on } from '@ember/object/evented';
import { notEmpty } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { EKMixin, keyDown } from 'ember-keyboard';
import OutsideClickMixin from 'things/mixins/outside-click';

function isCaretAtStart({ selectionStart, selectionEnd }) {
  return selectionStart === 0 && selectionEnd === 0;
}

function getNextItem(list, item) {
  let itemIndex = list.indexOf(item);

  if (itemIndex === -1) {
    return null;
  }

  return list.objectAt(itemIndex + 1);
}

function getPreviousItem(list, item) {
  let itemIndex = list.indexOf(item);

  if (itemIndex === -1) {
    return null;
  }

  return list.objectAt(itemIndex - 1);
}

export default Component.extend(EKMixin, OutsideClickMixin, {
  data: service(),

  classNames: ['c-tags-field'],
  keyboardPriority: 1,
  rawInput: null,
  isDropdownOn: false,
  itemTags: null,
  selectedTag: null,
  activeTagOption: null,

  keyboardActivated: notEmpty('selectedTag'),

  areOptionsShown: computed('isDropdownOn', 'normalizedInput', function() {
    return this.isDropdownOn && this.normalizedInput;
  }),

  normalizedInput: computed('rawInput', function() {
    return this.rawInput && this.rawInput.trim();
  }),

  tagOptions: computed('normalizedInput', 'itemTags.[]', 'data.tags.[]', function() {
    if (!this.normalizedInput) {
      return [];
    }

    let excludedTags = this.itemTags;
    let input = this.normalizedInput;

    return this.data.tags
      .filter(tag => tag.name.startsWith(input) && !excludedTags.includes(tag));
  }),

  onEnter: on(keyDown('Enter'), function() {
    this.clearTagSelection();
  }),

  onBackspace: on(keyDown('Backspace'), function(event) {
    event.preventDefault();

    let tagToRemove = this.selectedTag;
    let isLastTag = tagToRemove === this.itemTags.lastObject;

    if (isLastTag) {
      this.focusInput();
      this.moveInputCaretToStart();
    } else {
      this.selectTag(getNextItem(this.itemTags, tagToRemove));
    }

    this.removeTag(tagToRemove);
  }),

  onArrowLeft: on(keyDown('ArrowLeft'), function() {
    this.selectTag(getPreviousItem(this.itemTags, this.selectedTag));
  }),

  onArrowRight: on(keyDown('ArrowRight'), function(event) {
    let nextTag = getNextItem(this.itemTags, this.selectedTag);

    if (nextTag) {
      this.selectTag(nextTag);
    } else {
      event.preventDefault();
      this.focusInput();
      this.moveInputCaretToStart();
    }
  }),

  onTab: on(keyDown('Tab'), function() {
    this.deactivateComponent();
  }),

  onShiftTab: on(keyDown('shift+Tab'), function() {
    this.deactivateComponent();
  }),

  actions: {
    onInputFocusIn() {
      this.activateComponent();
      this.clearTagSelection();
      set(this, 'isDropdownOn', true);
    },

    onInputValueChanged(value) {
      set(this, 'rawInput', value);
      set(this, 'activeTagOption', this.tagOptions.firstObject);
    },

    onInputEnter() {
      if (!this.normalizedInput) {
        this.clearInput();
        this.blurInput();
        return;
      }

      if (this.activeTagOption) {
        this.addTag(this.activeTagOption);
      } else {
        this.createAndAddTag();
      }

      this.clearInput();
    },

    onInputEscape() {
      if (this.rawInput) {
        this.clearInput();
      } else {
        this.blurInput();
      }
    },

    onInputKeyDown(event) {
      let { target, key } = event;

      if (key === 'Tab') {
        this.deactivateComponent();
        return;
      }

      if (['ArrowLeft', 'Backspace'].includes(key) && isCaretAtStart(target)) {
        this.selectTag(this.itemTags.lastObject);
        event.stopPropagation();
        return;
      }

      if (key === 'ArrowUp') {
        let newActiveOption = this.activeTagOption
          ? this.tagOptions.objectAt(this.tagOptions.indexOf(this.activeTagOption) - 1)
          : this.tagOptions.lastObject;

        if (newActiveOption) {
          set(this, 'activeTagOption', newActiveOption);
        }

        // Preventing default behaviour where browser moves caret to start.
        event.preventDefault();
        return;
      }

      if (key === 'ArrowDown' && this.activeTagOption) {
        let activeIndex = this.tagOptions.indexOf(this.activeTagOption);
        let isLastOption = activeIndex === this.tagOptions.length - 1;
        let newActiveOption = isLastOption ? null : this.tagOptions.objectAt(activeIndex + 1);
        set(this, 'activeTagOption', newActiveOption);

        // Preventing default behaviour where browser moves caret to end.
        event.preventDefault();
      }
    },

    selectTag(tag) {
      this.activateComponent();
      this.selectTag(tag);
    },

    addTag(tag) {
      this.addTag(tag);
      this.clearInput();
      this.focusInput();
    },

    addNewTag() {
      this.createAndAddTag();
      this.clearInput();
      this.focusInput();
    },

    removeTag(tag) {
      if (tag === this.selectedTag) {
        this.selectTag(getNextItem(this.itemTags, tag));
      }

      this.removeTag(tag);
    },

    preventDropdownFromClosing() {
      return false;
    }
  },

  outsideClick({ target }) {
    let isDropdownClick = [...document.querySelectorAll('.js-dropdown')]
      .some(el => el.contains(target));

    if (isDropdownClick) {
      return;
    }

    this.deactivateComponent();
  },

  activateComponent() {
    this.startHandlingOutsideClick();
  },

  deactivateComponent() {
    set(this, 'isDropdownOn', false);
    this.clearTagSelection();
    this.stopHandlingOutsideClick();
  },

  createAndAddTag() {
    if (!this.normalizedInput) {
      return;
    }

    if (!this.data.tags.findBy('name', this.normalizedInput)) {
      this.addTag(this.createTag(this.normalizedInput));
    }
  },

  selectTag(tag) {
    if (!tag) {
      return;
    }

    set(this, 'selectedTag', tag);
    set(this, 'isDropdownOn', false);
    this.blurInput();
  },

  clearTagSelection() {
    set(this, 'selectedTag', null);
  },

  focusInput() {
    if (!this.element) {
      return;
    }

    this.element.querySelector('.js-input').focus();
  },

  clearInput() {
    set(this, 'rawInput', '');
  },

  moveInputCaretToStart() {
    if (!this.element) {
      return;
    }

    let inputElement = this.element.querySelector('.js-input');
    inputElement.selectionStart = 0;
    inputElement.selectionEnd = 0;
  },

  blurInput() {
    if (!this.element) {
      return;
    }

    this.element.querySelector('.js-input').blur();
  }
});
