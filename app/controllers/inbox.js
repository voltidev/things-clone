import Controller from '@ember/controller';
import { filterBy, notEmpty } from '@ember/object/computed';

export default Controller.extend({
  items: filterBy('model.tasks', 'isShownInInbox'),
  hasContent: notEmpty('items')
});
