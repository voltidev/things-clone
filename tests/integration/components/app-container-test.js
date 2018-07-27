import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, settled, waitUntil } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, build, buildList } from 'ember-data-factory-guy';
import { shouldBeEditing, shouldNotBeEditing } from 'things/tests/helpers/editing-mode';

module('Integration | Component | app-container', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  test('it renders properly', async function(assert) {
    this.set('tasks', buildList('task', 2));

    await render(hbs`
      {{app-container
        tasks=tasks
      }}
    `);

    assert.dom('[data-test-task]').exists({ count: 2 });
    assert.dom('[data-test-action-new-task]').exists();
  });

  test('it reflects editing mode in main section', async function(assert) {
    this.set('tasks', buildList('task', 2));

    await render(hbs`
      {{app-container
        tasks=tasks
      }}
    `);

    assert.dom('[data-test-main-section]').hasNoClass('is-editing');

    this.owner.lookup('service:task-editor').edit({});
    await settled();
    assert.dom('[data-test-main-section]').hasClass('is-editing');
  });

  test('it starts editing first selected task & deselects others on Enter', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let [task1, task2] = buildList('task', 2);
    this.set('tasks', [task1, task2]);
    taskSelector.select(task1, task2);

    await render(hbs`
      {{app-container
        tasks=tasks
      }}
    `);

    assert.ok(taskSelector.isSelected(task1), 'task1 is selected');
    assert.ok(taskSelector.isSelected(task2), 'task2 is selected');

    await triggerKeyEvent(this.element, 'keyup', 'Enter');
    assert.ok(taskSelector.isSelected(task1), 'task1 is selected');
    assert.notOk(taskSelector.isSelected(task2), 'task2 is not selected');
    shouldBeEditing('[data-test-task="1"]', assert);
    shouldNotBeEditing('[data-test-task="2"]', assert);
  });

  test('it deselect & deletes selected tasks on Backspace', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let tasks = buildList('task', 3);
    let [task1, task2] = tasks;
    this.set('tasks', tasks);
    this.set('deleteTasks', tasksToDelete => {
      tasksToDelete.forEach(task => tasks.removeObject(task));
      return Promise.resolve();
    });

    await render(hbs`
      {{app-container
        tasks=tasks
        deleteTasks=deleteTasks
      }}
    `);

    taskSelector.select(task1, task2);
    assert.ok(taskSelector.hasTasks, 'task1 & task2 are selected');
    assert.dom('[data-test-task]').exists({ count: 3 });

    await triggerKeyEvent(this.element, 'keyup', 'Backspace');
    await waitUntil(() => this.element.querySelectorAll('[data-test-task]').length === 1);
    assert.notOk(taskSelector.hasTasks, 'selection is cleared');
    assert.dom('[data-test-task]').exists({ count: 1 });
    assert.dom('[data-test-task="3"]').exists();
  });

  module('handling ArrowDown and ArrowUp keys', function(hooks) {
    hooks.beforeEach(async function() {
      this.taskSelector = this.owner.lookup('service:task-selector');
      this.tasks = buildList('task', 3);
      this.set('tasks', this.tasks);

      await render(hbs`
        {{app-container
          tasks=tasks
        }}
      `);
    });

    test('it deselects current & selects next task on ArrowDown', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      this.taskSelector.select(task1);
      await settled();

      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');

      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.ok(this.taskSelector.isSelected(task2), 'task2 is selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });

    test('it deselects all & selects next task from the top on ArrowDown', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      this.taskSelector.select(task1, task2, task3);
      await settled();
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.ok(this.taskSelector.isSelected(task2), 'task2 is selected');
      assert.ok(this.taskSelector.isSelected(task3), 'task3 is selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.ok(this.taskSelector.isSelected(task2), 'task2 is selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });

    test('it ignores ArrowDown if there is no next task', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      this.taskSelector.select(task3);
      await settled();
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.ok(this.taskSelector.isSelected(task3), 'task3 is selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.ok(this.taskSelector.isSelected(task3), 'task3 is selected');
    });

    test('it ignores ArrowDown if there is no selection', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });

    test('it deselects current & selects previous task on ArrowUp', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      this.taskSelector.select(task2);
      await settled();
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.ok(this.taskSelector.isSelected(task2), 'task2 is selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });

    test('it deselects all & selects previous task on ArrowUp', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      this.taskSelector.select(task2, task3);
      await settled();
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.ok(this.taskSelector.isSelected(task2), 'task2 is selected');
      assert.ok(this.taskSelector.isSelected(task3), 'task3 is selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });

    test('it deselects all & selects top task if there is no previous task on ArrowUp', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      this.taskSelector.select(task1, task2, task3);
      await settled();
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.ok(this.taskSelector.isSelected(task2), 'task2 is selected');
      assert.ok(this.taskSelector.isSelected(task3), 'task3 is selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });

    test('it ignores ArrowUp if there is no previous task', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      this.taskSelector.select(task1);
      await settled();
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });

    test('it ignores ArrowUp if there is no selection', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');
    });
  });

  module('handling new task creation', function(hooks) {
    hooks.beforeEach(async function() {
      let tasks = buildList('task', 1);
      this.set('tasks', tasks);
      this.set('createTask', () => {
        let newTask = build('task');
        tasks.pushObject(newTask);
        return Promise.resolve(newTask);
      });

      await render(hbs`
        {{app-container
          tasks=tasks
          createTask=createTask
        }}
      `);
    });

    test('it creates new task on newTask action click', async function(assert) {
      assert.dom('[data-test-task]').exists({ count: 1 });

      await click('[data-test-action-new-task]');
      assert.dom('[data-test-task]').exists({ count: 2 });
    });

    test('it creates new task on N keydown', async function(assert) {
      assert.dom('[data-test-task]').exists({ count: 1 });

      await triggerKeyEvent(this.element, 'keydown', 'N');
      assert.dom('[data-test-task]').exists({ count: 2 });
    });

    test('it starts editing new task', async function(assert) {
      await click('[data-test-action-new-task]');
      await settled();
      shouldNotBeEditing('[data-test-task="1"]', assert);
      shouldBeEditing('[data-test-task="2"]', assert);
      assert.dom('[data-test-task="2"] [data-test-task-name-input]').hasValue('task 2');
    });

    test('it selects new task and deselect others', async function(assert) {
      let taskSelector = this.owner.lookup('service:task-selector');
      await click('[data-test-task="1"]');
      assert.ok(taskSelector.isSelected(this.tasks[0]), 'task1 is selected');

      await click('[data-test-action-new-task]');
      assert.notOk(taskSelector.isSelected(this.tasks[0]), 'task1 is not selected');
      assert.ok(taskSelector.isSelected(this.tasks[1]), 'task2 is selected');
    });
  });
});
