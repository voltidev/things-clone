import Component from '@ember/component';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default Component.extend({
  * eachTransition({ keptSprites, insertedSprites, removedSprites }) {
    keptSprites.forEach(move);
    insertedSprites.forEach(fadeIn);
    removedSprites.forEach(fadeOut);
  }
});
