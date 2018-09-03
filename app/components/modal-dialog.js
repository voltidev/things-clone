import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { run } from '@ember/runloop';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';
import { Promise } from 'rsvp';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  classNames: ['c-dialog'],
  classNameBindings: ['isTransitioningIn', 'isTransitioningOut'],
  isTransitioningIn: true,
  isTransitioningOut: false,

  shortcutClose: on(keyDown('Escape'), function() {
    this.close();
  }),

  init() {
    this._super(...arguments);
    this.closeOnSideClick = this.closeOnSideClick.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);
    this.animateIt();
  },

  didRender() {
    this._super(...arguments);
    this.startHandlingRootClick();
  },

  willDestroyElement() {
    this.stopHandlingRootClick();
  },

  actions: {
    closeDialog() {
      this.closeDialog();
    }
  },

  closeDialog() {
    this.animateOut().then(() => this.close());
  },

  closeOnSideClick({ target }) {
    run(() => {
      if (!this.element.querySelector('.js-dialog-body').contains(target)) {
        this.closeDialog();
      }
    });
  },

  startHandlingRootClick() {
    document.addEventListener('mousedown', this.closeOnSideClick, true);
  },

  stopHandlingRootClick() {
    document.removeEventListener('mousedown', this.closeOnSideClick, true);
  },

  animateIt() {
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
