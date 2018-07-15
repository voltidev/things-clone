import DS from 'ember-data';
import { set } from '@ember/object';

const { attr, Model } = DS;

export default Model.extend({
  name: attr('string'),
  isDone: attr('boolean', { defaultValue: false }),
  createdAt: attr('date', {
    defaultValue() { return new Date(); }
  }),

  complete() {
    set(this, 'isDone', true);
  },

  uncomplete() {
    set(this, 'isDone', false);
  }
});
