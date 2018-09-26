import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { equal } from '@ember/object/computed';
import { set } from '@ember/object';

export default Model.extend({
  name: attr('string'),
  isDeleted: attr('boolean', { defaultValue: false }),

  tasks: hasMany('task'),
  projects: hasMany('project'),

  isActive: equal('isDeleted', false),

  delete() {
    set(this, 'isDeleted', true);
  }
});
