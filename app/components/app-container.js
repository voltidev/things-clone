import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Component.extend({
  taskEditor: service(),
  classNames: ['l-container'],
  isEditing: alias('taskEditor.hasTask')
});
