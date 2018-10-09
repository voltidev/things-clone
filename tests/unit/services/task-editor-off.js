import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | task-editor', function(hooks) {
  setupTest(hooks);

  test('hasTask property works', function(assert) {
    let taskEditor = this.owner.lookup('service:task-editor');

    assert.equal(taskEditor.hasTask, false);
    taskEditor.set('task', {});
    assert.equal(taskEditor.hasTask, true);
  });

  test('isEditing method works', function(assert) {
    let taskEditor = this.owner.lookup('service:task-editor');
    let task = {};

    assert.equal(taskEditor.isEditing(task), false);
    taskEditor.set('task', task);
    assert.equal(taskEditor.isEditing(task), true);
  });

  test('edit method works', function(assert) {
    let taskEditor = this.owner.lookup('service:task-editor');
    let task = {};

    assert.equal(taskEditor.task, null);
    taskEditor.edit(task);
    assert.equal(taskEditor.task, task);
  });

  test('clear method works', function(assert) {
    let taskEditor = this.owner.lookup('service:task-editor');
    let task = {};

    taskEditor.set('task', task);
    assert.equal(taskEditor.task, task);
    taskEditor.clear();
    assert.equal(taskEditor.task, null);
  });
});
