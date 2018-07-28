import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupFactoryGuy, make } from 'ember-data-factory-guy';

module('Unit | Controller | inbox', function(hooks) {
  setupTest(hooks);
  setupFactoryGuy(hooks);

  test('tasks property is the model sorted by order', function(assert) {
    let controller = this.owner.lookup('controller:inbox');
    let model = [make('task', { order: 2 }), make('task', { order: 1 })];
    let [task1, task2] = model;
    controller.set('model', model);
    assert.deepEqual(controller.tasks, [task2, task1]);

    let task3 = make('task', { order: 0 });
    model.pushObject(task3);
    assert.deepEqual(controller.tasks, [task3, task2, task1]);

    let task4 = make('task', { order: 3 });
    model.pushObject(task4);
    assert.deepEqual(controller.tasks, [task3, task2, task1, task4]);
  });
});
