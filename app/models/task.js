import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { set } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Model.extend({
  name: attr('string'),
  order: attr('number', { defaultValue: 0 }),
  isCompleted: attr('boolean', { defaultValue: false }),
  completedAt: attr('date'),
  deletedAt: attr('date'),
  folder: attr('string', { defaultValue: 'inbox' }),
  isDeleted: attr('boolean', { defaultValue: false }),

  createdAt: attr('date', {
    defaultValue() {
      return new Date();
    }
  }),

  isInbox: equal('folder', 'inbox'),

  complete() {
    set(this, 'isCompleted', true);
    set(this, 'completedAt', new Date());
  },

  delete() {
    set(this, 'isDeleted', true);
    set(this, 'deletedAt', new Date());
  },

  uncomplete() {
    set(this, 'isCompleted', false);
  }
});
