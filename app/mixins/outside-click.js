import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';
import { set } from '@ember/object';

export default Mixin.create({
  init() {
    this._super(...arguments);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);
    this.startHandlingOutsideClick();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.stopHandlingOutsideClick();
  },

  startHandlingOutsideClick() {
    if (this.isHandlingOutsideClick) {
      return;
    }

    document.addEventListener('mousedown', this.handleOutsideClick, true);
    set(this, 'isHandlingOutsideClick', true);
  },

  stopHandlingOutsideClick() {
    document.removeEventListener('mousedown', this.handleOutsideClick, true);
    set(this, 'isHandlingOutsideClick', false);
  },

  handleOutsideClick(event) {
    run(() => {
      if (!this.element.contains(event.target)) {
        this.outsideClick(event);
      }
    });
  }
});
