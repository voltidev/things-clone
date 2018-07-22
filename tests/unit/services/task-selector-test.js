import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | task-selector', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:task-selector');
    assert.ok(service);
  });
});
