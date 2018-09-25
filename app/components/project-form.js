import Component from '@ember/component';
import fade from 'ember-animated/transitions/fade';
import { set } from '@ember/object';

export default Component.extend({
  _nameFieldValue: '',
  _notesFieldValue: '',
  fade,

  init() {
    this._super(...arguments);
    set(this, '_nameFieldValue', this.project.name);
    set(this, '_notesFieldValue', this.project.notes);
  },

  didRender() {
    this._super(...arguments);

    if (!this.project.name) {
      this.focusNameField();
    }
  },

  actions: {
    blur(className) {
      let filed = this.element.querySelector(`.${className}`);

      if (filed) {
        filed.blur();
      }
    }
  },

  focusNameField() {
    let nameField = this.element.querySelector('.js-name-field');

    if (nameField) {
      nameField.focus();
    }
  }
});
