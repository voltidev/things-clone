import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, settled } from '@ember/test-helpers';
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
    let tasks = buildList('task', 2);
    this.set('tasks', tasks);
    taskSelector.select(...tasks);

    await render(hbs`
      {{app-container
        tasks=tasks
      }}
    `);

    assert.dom('[data-test-task="1"]').hasClass('is-selected');
    assert.dom('[data-test-task="2"]').hasClass('is-selected');
    shouldNotBeEditing('[data-test-task="1"]', assert);
    shouldNotBeEditing('[data-test-task="2"]', assert);

    await triggerKeyEvent(this.element, 'keyup', 'Enter');
    assert.dom('[data-test-task="1"]').hasClass('is-selected');
    assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
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
    assert.notOk(taskSelector.hasTasks, 'selection is cleared');
    assert.dom('[data-test-task]').exists({ count: 1 });
    assert.dom('[data-test-task="3"]').exists();
  });

  module('handling ArrowDown and ArrowUp keys', function(hooks) {
    hooks.beforeEach(async function() {
      this.taskSelector = this.owner.lookup('service:task-selector');
      this.set('tasks', buildList('task', 3));

      await render(hbs`
        {{app-container
          tasks=tasks
        }}
      `);
    });

    test('it deselects current & selects next task on ArrowDown', async function(assert) {
      this.taskSelector.select(this.tasks[0]);
      await settled();
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
    });

    test('it deselects all & selects next task from the top on ArrowDown', async function(assert) {
      this.taskSelector.select(...this.tasks);
      await settled();
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
      assert.dom('[data-test-task="3"]').hasClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
    });

    test('it ignores ArrowDown if there is no next task', async function(assert) {
      this.taskSelector.select(this.tasks[2]);
      await settled();
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasClass('is-selected');
    });

    test('it ignores ArrowDown if there is no selection', async function(assert) {
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
    });

    test('it deselects current & selects previous task on ArrowUp', async function(assert) {
      this.taskSelector.select(this.tasks[1]);
      await settled();
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
    });

    test('it deselects all & selects previous task on ArrowUp', async function(assert) {
      this.taskSelector.select(this.tasks[1], this.tasks[2]);
      await settled();
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
      assert.dom('[data-test-task="3"]').hasClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
    });

    test('it deselects all & selects top task if there is no previous task on ArrowUp', async function(assert) {
      this.taskSelector.select(...this.tasks);
      await settled();
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
      assert.dom('[data-test-task="3"]').hasClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
    });

    test('it ignores ArrowUp if there is no previous task', async function(assert) {
      this.taskSelector.select(this.tasks[0]);
      await settled();
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
    });

    test('it ignores ArrowUp if there is no selection', async function(assert) {
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="3"]').hasNoClass('is-selected');
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
      await click('[data-test-task="1"]');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');

      await click('[data-test-action-new-task]');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
    });
  });
});
