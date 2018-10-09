import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | task-selector', function(hooks) {
  setupTest(hooks);

  test('sortedTasks is sorted by order tasks property', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    itemSelector.select({ order: 2 }, { order: 1 });
    assert.deepEqual(itemSelector.items, [{ order: 2 }, { order: 1 }]);
    assert.deepEqual(itemSelector.sortedTasks, [{ order: 1 }, { order: 2 }]);

    itemSelector.select({ order: 0 });
    assert.deepEqual(itemSelector.sortedTasks, [{ order: 0 }, { order: 1 }, { order: 2 }]);

    itemSelector.select({ order: 3 });
    assert.deepEqual(itemSelector.sortedTasks, [
      { order: 0 },
      { order: 1 },
      { order: 2 },
      { order: 3 }
    ]);
  });

  test('hasTasks property works', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    assert.equal(itemSelector.hasItems, false);

    itemSelector.select({});
    assert.equal(itemSelector.hasItems, true);

    itemSelector.clear();
    assert.equal(itemSelector.hasItems, false);
  });

  test('isSelected method works', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task = {};
    assert.equal(itemSelector.isSelected(task), false);

    itemSelector.select(task);
    assert.equal(itemSelector.isSelected(task), true);

    itemSelector.deselect(task);
    assert.equal(itemSelector.isSelected(task), false);
  });

  test('select one task', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    assert.deepEqual(itemSelector.items, []);

    itemSelector.select(task2);
    assert.deepEqual(itemSelector.items, [task2]);

    itemSelector.select(task1);
    assert.deepEqual(itemSelector.items, [task2, task1]);
  });

  test('select multiple tasks', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    itemSelector.select(task1);
    assert.deepEqual(itemSelector.items, [task1]);

    itemSelector.select(task3, task2);
    assert.deepEqual(itemSelector.items, [task1, task3, task3]);
  });

  test('selectOnly one task', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    itemSelector.select(task1);
    assert.deepEqual(itemSelector.items, [task1]);

    itemSelector.selectOnly(task2);
    assert.deepEqual(itemSelector.items, [task2]);
  });

  test('selectOnly multiple tasks', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    itemSelector.select(task1);
    assert.deepEqual(itemSelector.items, [task1]);

    itemSelector.selectOnly(task3, task2);
    assert.deepEqual(itemSelector.items, [task3, task2]);

    itemSelector.selectOnly(task1, task2);
    assert.deepEqual(itemSelector.items, [task1, task2]);
  });

  test('deselect one task', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    itemSelector.select(task1, task2);
    assert.deepEqual(itemSelector.items, [task1, task2]);

    itemSelector.deselect(task2);
    assert.deepEqual(itemSelector.items, [task1]);
  });

  test('deselect multiple tasks', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    itemSelector.select(task1, task2, task3);
    assert.deepEqual(itemSelector.items, [task1, task2, task3]);

    itemSelector.deselect(task1, task2);
    assert.deepEqual(itemSelector.items, [task3]);
  });

  test('toggle one task', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    itemSelector.toggle(task1);
    assert.deepEqual(itemSelector.items, [task1]);

    itemSelector.toggle(task1);
    assert.deepEqual(itemSelector.items, []);

    itemSelector.toggle(task2);
    assert.deepEqual(itemSelector.items, [task2]);

    itemSelector.toggle(task1);
    assert.deepEqual(itemSelector.items, [task2, task1]);
  });

  test('toggle multiple tasks', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    itemSelector.toggle(task2, task3, task1);
    assert.deepEqual(itemSelector.items, [task2, task3, task1]);

    itemSelector.toggle(task2, task3);
    assert.deepEqual(itemSelector.items, [task1]);

    itemSelector.toggle(task1, task2, task3);
    assert.deepEqual(itemSelector.items, [task2, task3]);
  });

  test('clear method works', function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    itemSelector.select(task1, task2);
    assert.deepEqual(itemSelector.items, [task1, task2]);

    itemSelector.clear();
    assert.deepEqual(itemSelector.items, []);
  });
});
