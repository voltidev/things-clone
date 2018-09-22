import Component from '@ember/component';
import fade from 'ember-animated/transitions/fade';

export default Component.extend({
  fade,

  didRender() {
    this._super(...arguments);

    if (!this.project.name) {
      this.focusTitleInput();
    }
  },

  actions: {
    blurTitleInput() {
      let input = this.element.querySelector('.js-title-input');

      if (input) {
        input.blur();
      }
    }
  },

  focusTitleInput() {
    let input = this.element.querySelector('.js-title-input');

    if (input) {
      input.focus();
    }
  }
});
