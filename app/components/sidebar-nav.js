import Component from '@ember/component';
import move from 'ember-animated/motions/move';
import { inject as service } from '@ember/service';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Component.extend({
  data: service(),
  classNames: ['c-sidebar-nav'],

  * eachTransition({ keptSprites, insertedSprites, removedSprites }) {
    keptSprites.forEach(move);
    insertedSprites.forEach(fadeIn);
    removedSprites.forEach(fadeOut);
  }
});
