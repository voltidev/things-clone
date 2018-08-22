import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, EKFirstResponderOnFocusMixin, keyUp } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, EKFirstResponderOnFocusMixin, {
  tagName: 'input',
  type: 'text',

  attributeBindings: [
    'value',
    'placeholder'
  ],

  onEnter: on(keyUp('Enter'), function(event) {
    this.enter(event);
  }),

  onEscape: on(keyUp('Escape'), function(event) {
    this['escape-press'](event);
  }),

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
