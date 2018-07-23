import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | application', function(hooks) {
  setupTest(hooks);

  test('tasks property is the model sorted by order', function(assert) {
    let controller = this.owner.lookup('controller:application');
    let model = [{ order: 2 }, { order: 1 }];
    controller.set('model', model);
    assert.deepEqual(controller.tasks, [{ order: 1 }, { order: 2 }]);

    model.pushObject({ order: 0 });
    assert.deepEqual(controller.tasks, [{ order: 0 }, { order: 1 }, { order: 2 }]);

    model.pushObject({ order: 3 });
    assert.deepEqual(controller.tasks, [{ order: 0 }, { order: 1 }, { order: 2 }, { order: 3 }]);
  });
});
