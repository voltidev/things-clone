import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | task-selector', function(hooks) {
  setupTest(hooks);

  test('sortedTasks is sorted by order tasks property', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    taskSelector.select({ order: 2 }, { order: 1 });
    assert.deepEqual(taskSelector.tasks, [{ order: 2 }, { order: 1 }]);
    assert.deepEqual(taskSelector.sortedTasks, [{ order: 1 }, { order: 2 }]);

    taskSelector.select({ order: 0 });
    assert.deepEqual(taskSelector.sortedTasks, [{ order: 0 }, { order: 1 }, { order: 2 }]);

    taskSelector.select({ order: 3 });
    assert.deepEqual(taskSelector.sortedTasks, [
      { order: 0 },
      { order: 1 },
      { order: 2 },
      { order: 3 }
    ]);
  });

  test('hasTasks property works', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    assert.equal(taskSelector.hasTasks, false);

    taskSelector.select({});
    assert.equal(taskSelector.hasTasks, true);

    taskSelector.clear();
    assert.equal(taskSelector.hasTasks, false);
  });

  test('isSelected method works', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task = {};
    assert.equal(taskSelector.isSelected(task), false);

    taskSelector.select(task);
    assert.equal(taskSelector.isSelected(task), true);

    taskSelector.deselect(task);
    assert.equal(taskSelector.isSelected(task), false);
  });

  test('select one task', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    assert.deepEqual(taskSelector.tasks, []);

    taskSelector.select(task2);
    assert.deepEqual(taskSelector.tasks, [task2]);

    taskSelector.select(task1);
    assert.deepEqual(taskSelector.tasks, [task2, task1]);
  });

  test('select multiple tasks', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    taskSelector.select(task1);
    assert.deepEqual(taskSelector.tasks, [task1]);

    taskSelector.select(task3, task2);
    assert.deepEqual(taskSelector.tasks, [task1, task3, task3]);
  });

  test('selectOnly one task', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    taskSelector.select(task1);
    assert.deepEqual(taskSelector.tasks, [task1]);

    taskSelector.selectOnly(task2);
    assert.deepEqual(taskSelector.tasks, [task2]);
  });

  test('selectOnly multiple tasks', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    taskSelector.select(task1);
    assert.deepEqual(taskSelector.tasks, [task1]);

    taskSelector.selectOnly(task3, task2);
    assert.deepEqual(taskSelector.tasks, [task3, task2]);

    taskSelector.selectOnly(task1, task2);
    assert.deepEqual(taskSelector.tasks, [task1, task2]);
  });

  test('deselect one task', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    taskSelector.select(task1, task2);
    assert.deepEqual(taskSelector.tasks, [task1, task2]);

    taskSelector.deselect(task2);
    assert.deepEqual(taskSelector.tasks, [task1]);
  });

  test('deselect multiple tasks', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    taskSelector.select(task1, task2, task3);
    assert.deepEqual(taskSelector.tasks, [task1, task2, task3]);

    taskSelector.deselect(task1, task2);
    assert.deepEqual(taskSelector.tasks, [task3]);
  });

  test('toggle one task', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    taskSelector.toggle(task1);
    assert.deepEqual(taskSelector.tasks, [task1]);

    taskSelector.toggle(task1);
    assert.deepEqual(taskSelector.tasks, []);

    taskSelector.toggle(task2);
    assert.deepEqual(taskSelector.tasks, [task2]);

    taskSelector.toggle(task1);
    assert.deepEqual(taskSelector.tasks, [task2, task1]);
  });

  test('toggle multiple tasks', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    taskSelector.toggle(task2, task3, task1);
    assert.deepEqual(taskSelector.tasks, [task2, task3, task1]);

    taskSelector.toggle(task2, task3);
    assert.deepEqual(taskSelector.tasks, [task1]);

    taskSelector.toggle(task1, task2, task3);
    assert.deepEqual(taskSelector.tasks, [task2, task3]);
  });

  test('clear method works', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    taskSelector.select(task1, task2);
    assert.deepEqual(taskSelector.tasks, [task1, task2]);

    taskSelector.clear();
    assert.deepEqual(taskSelector.tasks, []);
  });
});
