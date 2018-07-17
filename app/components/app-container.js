import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { alias } from '@ember/object/computed';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskEditor: service(),
  classNames: ['l-container'],
  isEditMode: alias('taskEditor.hasTask'),

  shortcutCreateTask: on(keyDown('KeyN'), function(event) {
    this.createTask();
    event.preventDefault();
  })
});
