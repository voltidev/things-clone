import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

const CIRCUMFERENCE = 25.1327412287;

export default Component.extend({
  progress: 0,
  CIRCUMFERENCE,
  isZero: equal('progress', 0),

  strokeDasharray: computed('progress', function() {
    return this.progress * CIRCUMFERENCE / 100;
  })
});
