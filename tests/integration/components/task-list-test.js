import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent, triggerKeyEvent, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, makeList } from 'ember-data-factory-guy';

module('Integration | Component | task-list', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  test('it renders properly', async function(assert) {
    this.set('tasks', makeList('task', 'completed', 'default'));

    await render(hbs`
      {{#task-list
        tasks=this.tasks
        as |task selectBetween|
      }}
        {{task-item
          task=task
          selectBetween=selectBetween
          data-test-task=task.id
        }}
      {{/task-list}}
    `);

    assert.dom('[data-test-task]').exists({ count: 2 });
    assert.dom('[data-test-task="1"]').hasClass('is-completed');
    assert.dom('[data-test-task="1"]').hasText('task 1');
    assert.dom('[data-test-task="2"]').hasNoClass('is-completed');
    assert.dom('[data-test-task="2"]').hasText('task 2');
  });

  test('task-wrapper is not selected by default', async function(assert) {
    this.set('tasks', makeList('task', 1));

    await render(hbs`
      {{#task-list
        tasks=this.tasks
        as |task selectBetween|
      }}
        {{task-item
          task=task
          selectBetween=selectBetween
          data-test-task=task.id
        }}
      {{/task-list}}
    `);

    assert.dom('[data-test-task-wrapper]').hasNoClass('is-selected');
  });

  test('it updates task-wrapper when taskSelector state changes', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let [task1, task2] = makeList('task', 2);
    this.set('tasks', [task1, task2]);

    await render(hbs`
      {{#task-list
        tasks=this.tasks
        as |task selectBetween|
      }}
        {{task-item
          task=task
          selectBetween=selectBetween
          data-test-task=task.id
        }}
      {{/task-list}}
    `);

    assert.dom('[data-test-task-wrapper="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-task-wrapper="2"]').hasNoClass('is-selected');

    taskSelector.select(task1);
    await settled();
    assert.dom('[data-test-task-wrapper="1"]').hasClass('is-selected');
    assert.dom('[data-test-task-wrapper="2"]').hasNoClass('is-selected');

    taskSelector.selectOnly(task2);
    await settled();
    assert.dom('[data-test-task-wrapper="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-task-wrapper="2"]').hasClass('is-selected');
  });

  test('it handles selection with shiftKey from top to bottom', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let [task1, task2, task3, task4] = makeList('task', 4);
    this.set('tasks', [task1, task2, task3, task4]);
    taskSelector.select(task1, task3, task4);

    await render(hbs`
      {{#task-list
        tasks=this.tasks
        as |task selectBetween|
      }}
        {{task-item
          task=task
          selectBetween=selectBetween
          data-test-task=task.id
        }}
      {{/task-list}}
    `);

    assert.ok(taskSelector.isSelected(task1), 'task1 is selected before click');
    assert.notOk(taskSelector.isSelected(task2), 'task2 is not selected before click');
    assert.ok(taskSelector.isSelected(task3), 'task3 is selected before click');
    assert.ok(taskSelector.isSelected(task4), 'task4 is selected before click');

    await triggerEvent('[data-test-task="3"]', 'mousedown', { shiftKey: true });
    assert.ok(taskSelector.isSelected(task1), 'task1 is selected after click');
    assert.ok(taskSelector.isSelected(task2), 'task2 is selected after click');
    assert.ok(taskSelector.isSelected(task3), 'task3 is selected after click');
    assert.notOk(taskSelector.isSelected(task4), 'task4 is not selected after click');
  });

  test('it handles selection with shiftKey from bottom to top', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let [task1, task2, task3, task4] = makeList('task', 4);
    this.set('tasks', [task1, task2, task3, task4]);
    taskSelector.select(task2, task4);

    await render(hbs`
      {{#task-list
        tasks=this.tasks
        as |task selectBetween|
      }}
        {{task-item
          task=task
          selectBetween=selectBetween
          data-test-task=task.id
        }}
      {{/task-list}}
    `);

    assert.notOk(taskSelector.isSelected(task1), 'task1 is not selected before click');
    assert.ok(taskSelector.isSelected(task2), 'task2 is selected before click');
    assert.notOk(taskSelector.isSelected(task3), 'task3 is not selected before click');
    assert.ok(taskSelector.isSelected(task4), 'task4 is selected before click');

    await triggerEvent('[data-test-task="2"]', 'mousedown', { shiftKey: true });
    assert.notOk(taskSelector.isSelected(task1), 'task1 is not selected after click');
    assert.ok(taskSelector.isSelected(task2), 'task2 is selected after click');
    assert.ok(taskSelector.isSelected(task3), 'task3 is selected after click');
    assert.ok(taskSelector.isSelected(task4), 'task4 is selected after click');
  });

  module('handling ArrowDown and ArrowUp keys', function(hooks) {
    hooks.beforeEach(async function() {
      this.taskSelector = this.owner.lookup('service:task-selector');
      this.tasks = makeList('task', 3);
      this.set('tasks', this.tasks);

      await render(hbs`
        {{#task-list
          tasks=this.tasks
          as |task selectBetween|
        }}
          {{task-item
            task=task
            selectBetween=selectBetween
            data-test-task=task.id
          }}
        {{/task-list}}
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

    test('it selects first task if there is no selection on ArrowDown', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowDown');
      assert.ok(this.taskSelector.isSelected(task1), 'task1 is selected');
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

    test('it selects last task if there is no selection on ArrowUp', async function(assert) {
      let [task1, task2, task3] = this.tasks;
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.notOk(this.taskSelector.isSelected(task3), 'task3 is not selected');

      await triggerKeyEvent(this.element, 'keydown', 'ArrowUp');
      assert.notOk(this.taskSelector.isSelected(task1), 'task1 is not selected');
      assert.notOk(this.taskSelector.isSelected(task2), 'task2 is not selected');
      assert.ok(this.taskSelector.isSelected(task3), 'task3 is selected');
    });
  });
});
