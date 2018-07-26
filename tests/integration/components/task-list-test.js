import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, buildList } from 'ember-data-factory-guy';

module('Integration | Component | task-list', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  test('it renders tasks properly', async function(assert) {
    this.set('tasks', buildList('task', 'complete', 'default'));

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
    let [task1, task2, task3, task4] = buildList('task', 4);
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
    let [task1, task2, task3, task4] = buildList('task', 4);
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
