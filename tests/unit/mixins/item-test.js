import EmberObject from '@ember/object';
import ItemMixin from 'things/mixins/item';
import { module, test } from 'qunit';

module('Unit | Mixin | item', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ItemObject = EmberObject.extend(ItemMixin);
    let subject = ItemObject.create();
    assert.ok(subject);
  });
});
