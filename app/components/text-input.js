import Component from '@ember/component';
import { EKMixin, EKFirstResponderOnFocusMixin } from 'ember-keyboard';

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

export default Component.extend(EKMixin, EKFirstResponderOnFocusMixin, {
  tagName: 'input',
  type: 'text',

  attributeBindings: [
    'value',
    'placeholder'
  ],

  keyUp(event) {
    if (event.keyCode === ENTER_KEY && this.enter) {
      this.enter(event);
    } else if (event.keyCode === ESCAPE_KEY && this['escape-press']) {
      this['escape-press'](event);
    } else {
      return;
    }

    event.stopPropagation();
  },

  change(event) {
    this._processNewValue(event.target.value);
  },

  input(event) {
    this._processNewValue(event.target.value);
  },

  _processNewValue(value) {
    if (this.value !== value) {
      this.update(value);
    }
  }
});
