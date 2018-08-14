import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | project', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:project');
    assert.ok(route);
  });
});
