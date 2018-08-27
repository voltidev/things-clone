import Component from '@ember/component';
import { computed } from '@ember/object';

const CIRCUMFERENCE = 25.1327412287;

export default Component.extend({
  progress: 0,
  CIRCUMFERENCE,

  strokeDasharray: computed('progress', function() {
    return this.progress * CIRCUMFERENCE / 100;
  })
});
