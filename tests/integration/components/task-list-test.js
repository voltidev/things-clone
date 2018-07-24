import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
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
});
