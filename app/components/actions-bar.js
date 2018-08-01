import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  taskEditor: service(),
  taskSelector: service(),
  classNames: ['c-actions-bar', 'js-actions-bar'],
  classNameBindings: ['hasSelected'],
  isEditing: alias('taskEditor.hasTask'),
  hasSelected: alias('taskSelector.hasTasks')
});
