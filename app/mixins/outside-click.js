import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';

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
    document.addEventListener('mousedown', this.handleOutsideClick, true);
  },

  stopHandlingOutsideClick() {
    document.removeEventListener('mousedown', this.handleOutsideClick, true);
  },

  handleOutsideClick(event) {
    run(() => {
      if (!this.element.contains(event.target)) {
        this.outsideClick(event);
      }
    });
  }
});
