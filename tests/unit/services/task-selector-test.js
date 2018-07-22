import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | task-selector', function(hooks) {
  setupTest(hooks);

  test('hasTasks property works', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');

    assert.equal(taskSelector.hasTasks, false);
    taskSelector.tasks.pushObject({});
    assert.equal(taskSelector.hasTasks, true);
  });

  test('isSelected method works', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task = {};

    assert.equal(taskSelector.isSelected(task), false);
    taskSelector.tasks.pushObject(task);
    assert.equal(taskSelector.isSelected(task), true);
  });

  test('select one task', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    assert.equal(taskSelector.isSelected(task1), false);
    assert.equal(taskSelector.isSelected(task2), false);

    taskSelector.select([task1]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), false);
  });

  test('select two tasks more', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    assert.equal(taskSelector.isSelected(task1), false);
    assert.equal(taskSelector.isSelected(task2), false);
    assert.equal(taskSelector.isSelected(task3), false);

    taskSelector.select([task1]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), false);
    assert.equal(taskSelector.isSelected(task3), false);

    taskSelector.select([task2, task3]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), true);
    assert.equal(taskSelector.isSelected(task3), true);
  });

  test('selectOnly method works', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    taskSelector.select([task1, task2]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), true);
    assert.equal(taskSelector.isSelected(task3), false);

    taskSelector.selectOnly(task3);
    assert.equal(taskSelector.isSelected(task1), false);
    assert.equal(taskSelector.isSelected(task2), false);
    assert.equal(taskSelector.isSelected(task3), true);
  });

  test('deselect one task', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    taskSelector.select([task1, task2]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), true);

    taskSelector.deselect([task2]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), false);
  });

  test('deselect two tasks', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};
    let task3 = {};

    taskSelector.select([task1, task2, task3]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), true);
    assert.equal(taskSelector.isSelected(task3), true);

    taskSelector.deselect([task1, task2]);
    assert.equal(taskSelector.isSelected(task1), false);
    assert.equal(taskSelector.isSelected(task2), false);
    assert.equal(taskSelector.isSelected(task3), true);
  });

  test('clear method works', function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = {};
    let task2 = {};

    taskSelector.select([task1, task2]);
    assert.equal(taskSelector.isSelected(task1), true);
    assert.equal(taskSelector.isSelected(task2), true);

    taskSelector.clear();
    assert.equal(taskSelector.isSelected(task1), false);
    assert.equal(taskSelector.isSelected(task2), false);
  });
});
