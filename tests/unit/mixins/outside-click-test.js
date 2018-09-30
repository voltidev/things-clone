import EmberObject from '@ember/object';
import OutsideClickMixin from 'things/mixins/outside-click';
import { module, test } from 'qunit';

module('Unit | Mixin | outside-click', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let OutsideClickObject = EmberObject.extend(OutsideClickMixin);
    let subject = OutsideClickObject.create();
    assert.ok(subject);
  });
});
