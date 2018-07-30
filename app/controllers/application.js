import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';

export default Controller.extend({
  taskEditor: service(),
  isEditing: alias('taskEditor.hasTask')
});
