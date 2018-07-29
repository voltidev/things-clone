import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { set } from '@ember/object';

export default Controller.extend({
  taskEditor: service(),
  isShortcutBarOpen: false,
  isEditing: alias('taskEditor.hasTask'),

  actions: {
    setSearchQuery(query) {
      set(this, 'query', query);
    },

    showShortcutBar() {
      set(this, 'isShortcutBarOpen', true);
    },

    toggleShortcutBar() {
      set(this, 'isShortcutBarOpen', !this.isShortcutBarOpen);
    }
  }
});
