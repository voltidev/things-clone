import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerKeyEvent, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { shouldBeEditing, shouldNotBeEditing } from '../../helpers/editing-mode';

module('Integration | Component | app-container', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders properly', async function(assert) {
    this.set('tasks', [
      { id: 1, name: 'task 1', isComplete: false },
      { id: 2, name: 'task 2', isComplete: false }
    ]);

    await render(hbs`
      {{app-container
        tasks=tasks
      }}
    `);

    assert.dom('[data-test-task]').exists({ count: 2 });
    assert.dom('[data-test-action-new-task]').exists();
  });

  test('it reflects editing mode in main section', async function(assert) {
    this.set('tasks', [
      { id: 1, name: 'task 1', isComplete: false },
      { id: 2, name: 'task 2', isComplete: false }
    ]);

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

  test('it starts editing selected task on Enter', async function(assert) {
    this.set('tasks', [
      { id: 1, name: 'task 1', isComplete: false },
      { id: 2, name: 'task 2', isComplete: false }
    ]);

    await render(hbs`
      {{app-container
        tasks=tasks
      }}
    `);

    shouldNotBeEditing('[data-test-task="1"]', assert);
    shouldNotBeEditing('[data-test-task="2"]', assert);

    await click('[data-test-task="1"]');
    await triggerKeyEvent(this.element, 'keyup', 'Enter');
    shouldBeEditing('[data-test-task="1"]', assert);
    shouldNotBeEditing('[data-test-task="2"]', assert);
  });

  test('it deselect & deletes selected tasks on Backspace', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let tasks = [
      { id: 1, name: 'task 1', isComplete: false },
      { id: 2, name: 'task 2', isComplete: false },
      { id: 3, name: 'task 3', isComplete: false }
    ];
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

    taskSelector.select([tasks[0], tasks[1]]);
    assert.ok(taskSelector.hasTasks, 'two tasks are selected');
    assert.dom('[data-test-task]').exists({ count: 3 });

    await triggerKeyEvent(this.element, 'keyup', 'Backspace');
    assert.notOk(taskSelector.hasTasks, 'selection is cleared');
    assert.dom('[data-test-task]').exists({ count: 1 });
    assert.dom('[data-test-task="3"]').exists();
  });

  module('handling ArrowDown and ArrowUp keys', function(hooks) {
    hooks.beforeEach(async function() {
      this.set('tasks', [
        { id: 1, name: 'task 1', isComplete: false },
        { id: 2, name: 'task 2', isComplete: false }
      ]);

      await render(hbs`
        {{app-container
          tasks=tasks
        }}
      `);
    });

    test('it deselects current & selects next task on ArrowDown', async function(assert) {
      await click('[data-test-task="1"]');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
    });

    test('it ignores ArrowDown if there is no next task', async function(assert) {
      await click('[data-test-task="2"]');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');
    });

    test('it ignores ArrowDown if there is no selection', async function(assert) {
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
    });

    test('it deselects current & selects previous task on ArrowUp', async function(assert) {
      await click('[data-test-task="2"]');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
    });

    test('it ignores ArrowUp if there is no next task', async function(assert) {
      await click('[data-test-task="1"]');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
    });

    test('it ignores ArrowUp if there is no selection', async function(assert) {
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.dom('[data-test-task="1"]').hasNoClass('is-selected');
      assert.dom('[data-test-task="2"]').hasNoClass('is-selected');
    });
  });

  module('handling new task creation', function(hooks) {
    hooks.beforeEach(async function() {
      let tasks = [{ id: 1, name: 'task 1', isComplete: false }];
      this.set('tasks', tasks);
      this.set('createTask', () => {
        let newTask = { id: 2, name: 'new task', isComplete: false };
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
      assert.dom('[data-test-task="2"] [data-test-task-name-input]').hasValue('new task');
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
