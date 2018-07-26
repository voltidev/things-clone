import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | task-list', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders tasks properly', async function(assert) {
    this.set('tasks', [
      { id: 1, name: 'task 1', isComplete: true },
      { id: 2, name: 'task 2', isComplete: false }
    ]);

    await render(hbs`
      {{task-list
        tasks=tasks
      }}
    `);

    assert.dom('[data-test-task]').exists({ count: 2 });
    assert.dom('[data-test-task="1"]').hasClass('is-complete');
    assert.dom('[data-test-task="1"]').hasText('task 1');
    assert.dom('[data-test-task="2"]').hasNoClass('is-complete');
    assert.dom('[data-test-task="2"]').hasText('task 2');
  });

  test('it handles selection with shiftKey from top to bottom', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = { id: 1, name: 'task 1', order: 1, isComplete: false };
    let task2 = { id: 2, name: 'task 2', order: 2, isComplete: false };
    let task3 = { id: 3, name: 'task 3', order: 3, isComplete: false };
    let task4 = { id: 4, name: 'task 4', order: 4, isComplete: false };
    this.set('tasks', [task1, task2, task3, task4]);
    taskSelector.select([task1, task3, task4]);
    await render(hbs`
      {{task-list
        tasks=tasks
      }}
    `);

    assert.ok(taskSelector.isSelected(task1), 'task1 is selected before click');
    assert.notOk(taskSelector.isSelected(task2), 'task2 is not selected before click');
    assert.ok(taskSelector.isSelected(task3), 'task3 is selected before click');
    assert.ok(taskSelector.isSelected(task4), 'task4 is selected before click');

    await triggerEvent('[data-test-task="3"]', 'click', { shiftKey: true });
    assert.ok(taskSelector.isSelected(task1), 'task1 is selected after click');
    assert.ok(taskSelector.isSelected(task2), 'task2 is selected after click');
    assert.ok(taskSelector.isSelected(task3), 'task3 is selected after click');
    assert.notOk(taskSelector.isSelected(task4), 'task4 is not selected after click');
  });

  test('it handles selection with shiftKey from bottom to top', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task1 = { id: 1, name: 'task 1', order: 1, isComplete: false };
    let task2 = { id: 2, name: 'task 2', order: 2, isComplete: false };
    let task3 = { id: 3, name: 'task 3', order: 3, isComplete: false };
    let task4 = { id: 4, name: 'task 4', order: 4, isComplete: false };
    this.set('tasks', [task1, task2, task3, task4]);
    taskSelector.select([task2, task4]);
    await render(hbs`
      {{task-list
        tasks=tasks
      }}
    `);

    assert.notOk(taskSelector.isSelected(task1), 'task1 is not selected before click');
    assert.ok(taskSelector.isSelected(task2), 'task2 is selected before click');
    assert.notOk(taskSelector.isSelected(task3), 'task3 is not selected before click');
    assert.ok(taskSelector.isSelected(task4), 'task4 is selected before click');

    await triggerEvent('[data-test-task="2"]', 'click', { shiftKey: true });
    assert.notOk(taskSelector.isSelected(task1), 'task1 is not selected after click');
    assert.ok(taskSelector.isSelected(task2), 'task2 is selected after click');
    assert.ok(taskSelector.isSelected(task3), 'task3 is selected after click');
    assert.ok(taskSelector.isSelected(task4), 'task4 is selected after click');
  });
});
