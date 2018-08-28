import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  classNames: ['c-dialog', 'js-move-dialog'],

  shortcutClose: on(keyDown('Escape'), function() {
    this.close();
  }),

  init() {
    this._super(...arguments);
    this.closeOnSideClick = this.closeOnSideClick.bind(this);
  },

  didRender() {
    this._super(...arguments);
    this.startHandlingRootClick();
  },

  willDestroyElement() {
    this.stopHandlingRootClick();
  },

  closeOnSideClick({ target }) {
    run(() => {
      if (!this.element.querySelector('.js-dialog-body').contains(target)) {
        this.close();
      }
    });
  },

  startHandlingRootClick() {
    document.addEventListener('mousedown', this.closeOnSideClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('mousedown', this.closeOnSideClick, true);
  }
});
