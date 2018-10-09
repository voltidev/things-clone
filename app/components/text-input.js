import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnFocusMixin, EKFirstResponderOnFocusMixin, keyUp } from 'ember-keyboard';
import { computed, set } from '@ember/object';
import AutoResize from 'ember-autoresize/mixins/autoresize';

export default Component.extend(
  AutoResize,
  EKMixin,
  EKOnFocusMixin,
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
      if (this.enter) {
        this.enter(event);
      }
    }),

    onEscape: on(keyUp('Escape'), function(event) {
      if (this['escape-press']) {
        this['escape-press'](event);
      }
    }),

    init() {
      this._super(...arguments);

      // eslint-disable-next-line ember/no-attrs-in-components
      let dataAttrs = Object.keys(this.attrs).filter(attr => attr.indexOf('data-') === 0);
      set(this, 'attributeBindings', [...this.attributeBindings, ...dataAttrs]);
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
  }
);
