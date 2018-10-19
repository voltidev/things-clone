import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';

function capitalize(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export default Component.extend({
  router: service(),
  data: service(),
  tagsFilter: service(),

  classNames: ['c-tags-filter'],
  routeName: alias('router.currentRouteName'),
  isNoTagMode: alias('tagsFilter.isNoTagMode'),
  isAllTagsMode: alias('tagsFilter.isAllTagsMode'),

  tagsForProject: computed(
    'project',
    'project.tasks.[]',
    'project.tasks.@each.{tags,isShownInProjectAnytime,isShownInProjectUpcoming,isShownInProjectSomeday,isShownInProjectLogbook}',
    function() {
      return this.project.tasks
        .filter(task => (
          task.isShownInProjectAnytime
          || task.isShownInProjectUpcoming
          || task.isShownInProjectSomeday
          || task.isShownInProjectLogbook
        ))
        .reduce((tags, task) => tags.addObjects(task.tags.toArray()), []);
    }
  ),

  tagsForList: computed(
    'routeName',
    'data.tags.[]',
    'data.tags.@each.{isShownInInbox,isShownInToday,isShownInUpcoming,isShownInAnytime,isShownInSomeday}',
    function() {
      return this.data.tags.filterBy(`isShownIn${capitalize(this.routeName)}`, true);
    }
  ),

  actions: {
    selectItem(item) {
      this.tagsFilter.selectOnly(item);
    },

    toggleItem(item) {
      this.tagsFilter.toggle(item);
    },

    clearFilter() {
      this.tagsFilter.clear();
    },

    enableNoTagMode() {
      this.tagsFilter.enableNoTagMode();
    }
  }
});
