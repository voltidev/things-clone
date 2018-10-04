import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';
import { Promise } from 'rsvp';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  classNames: ['c-dialog'],
  classNameBindings: ['isTransitioningIn', 'isTransitioningOut'],
  isTransitioningIn: true,
  isTransitioningOut: false,
  keyboardPriority: 1,

  shortcutClose: on(keyDown('Escape'), function() {
    this.close();
  }),

  didInsertElement() {
    this._super(...arguments);
    this.animateIn();
  },

  actions: {
    closeDialog() {
      this.closeDialog();
    }
  },

  closeDialog() {
    this.animateOut().then(() => this.close());
  },

  click({ target }) {
    if (target === this.element) {
      this.closeDialog();
    }
  },

  animateIn() {
    this.set('isTransitioningIn', true);

    return this.waitForAnimations(this.element)
      .then(() => this.set('isTransitioningIn', false));
  },

  animateOut() {
    this.set('isTransitioningOut', true);

    return this.waitForAnimations(this.element)
      .then(() => this.set('isTransitioningOut', false));
  },

  waitForAnimations() {
    return new Promise(resolve => {
      window.requestAnimationFrame(() => {
        let { animationName, animationPlayState } = window.getComputedStyle(this.element);

        if (animationName === 'none' && animationPlayState !== 'running') {
          resolve();
        }

        this.element.addEventListener('animationend', () => resolve(), { once: true });
      });
    });
  }
});
