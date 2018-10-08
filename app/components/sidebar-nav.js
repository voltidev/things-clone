import Component from '@ember/component';
import move from 'ember-animated/motions/move';
import { inject as service } from '@ember/service';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Component.extend({
  data: service(),
  classNames: ['c-sidebar-nav'],

  actions: {
    fixFocusOut() {
      // Work-around to trigger focus-out event that is broken by
      // `ember-sortable` (it calls preventDefault on click).
      // Without the fix, project form won't work properly when user clicks on any project link-to.
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  },

  * eachTransition({ keptSprites, insertedSprites, removedSprites }) {
    keptSprites.forEach(move);
    insertedSprites.forEach(fadeIn);
    removedSprites.forEach(fadeOut);
  }
});
