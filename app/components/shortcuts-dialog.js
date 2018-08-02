import Component from '@ember/component';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, keyDown } from 'ember-keyboard';

export default Component.extend(EKMixin, EKOnInsertMixin, {
  shortcutClose: on(keyDown('Escape'), function() {
    this.close();
  })
});
