import Component from '@ember/component';
import fade from 'ember-animated/transitions/fade';
import { set } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';

export default Component.extend({
  classNames: ['c-item-form'],
  nameFieldValue: '',
  notesFieldValue: '',
  fade,

  didReceiveAttrs() {
    this._super(...arguments);
    set(this, 'nameFieldValue', this.project.name);
    set(this, 'notesFieldValue', this.project.notes);

    if (!this.project.name) {
      scheduleOnce('afterRender', this, this.focusNameField);
    }
  },

  actions: {
    blur(className) {
      let filed = this.element.querySelector(`.${className}`);

      if (filed) {
        filed.blur();
      }
    },

    resetDropdown() {
      set(this, 'isWhenDropdownOpen', false);
      set(this, 'isDeadlineDropdownOpen', false);
    }
  },

  focusNameField() {
    let nameField = this.element.querySelector('.js-name-field');

    if (nameField) {
      nameField.focus();
    }
  }
});
