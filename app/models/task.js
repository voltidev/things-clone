import DS from 'ember-data';

const { attr, Model } = DS;

export default Model.extend({
  name: attr('string'),
  isDone: attr('boolean', { defaultValue: false }),
  createdAt: attr('date', {
    defaultValue() { return new Date(); }
  }),

  complete() {
    this.set('isDone', true);
  },

  uncomplete() {
    this.set('isDone', false);
  }
});
