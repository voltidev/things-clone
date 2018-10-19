import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { computed } from '@ember/object';

export default Model.extend({
  name: attr('string'),

  tasks: hasMany('task'),
  projects: hasMany('project'),

  isShownInInbox: computed(
    'tasks.[]',
    'tasks.@each.{isShownInInbox}',
    function() {
      return this.tasks.any(item => item.isShownInInbox);
    }
  ),

  isShownInToday: computed(
    'tasks.[]',
    'tasks.@each.{isShownInToday}',
    'projects.@each.{isShownInToday}',
    function() {
      return this.tasks.any(item => item.isShownInToday)
      || this.projects.any(item => item.isShownInToday);
    }
  ),

  isShownInUpcoming: computed(
    'tasks.[]',
    'tasks.@each.{isShownInUpcoming}',
    'projects.@each.{isShownInUpcoming}',
    function() {
      return this.tasks.any(item => item.isShownInUpcoming)
      || this.projects.any(item => item.isShownInUpcoming);
    }
  ),

  isShownInAnytime: computed(
    'tasks.[]',
    'tasks.@each.{isShownInAnytime}',
    function() {
      return this.tasks.any(item => item.isShownInAnytime);
    }
  ),

  isShownInSomeday: computed(
    'tasks.[]',
    'tasks.@each.{isShownInSomeday}',
    'projects.@each.{isShownInSomeday}',
    function() {
      return this.tasks.any(item => item.isShownInSomeday)
      || this.projects.any(item => item.isShownInSomeday);
    }
  )
});
