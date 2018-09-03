import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, EKFirstResponderOnFocusMixin, keyUp } from 'ember-keyboard';
import { computed } from '@ember/object';
import AutoResize from 'ember-autoresize/mixins/autoresize';

export default Component.extend(
  AutoResize,
  EKMixin,
  EKOnInsertMixin,
  EKFirstResponderOnFocusMixin,
  {
    tagName: 'input',
    type: 'text',
    shouldResizeWidth: true,
    significantWhitespace: true,
    attributeBindings: ['value', 'placeholder'],

    autoResizeText: computed('value', 'placeholder', function() {
      if (!this.value) {
        return this.placeholder ? this.placeholder : '.';
      }

      return this.value;
    }),

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
  }
);
