import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, make } from 'ember-data-factory-guy';

module('Integration | Helper | is-selected', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  test('it works properly', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let task = make('task');
    this.set('task', task);

    await render(hbs`{{is-selected task}}`);
    assert.equal(this.element.textContent.trim(), 'false');

    taskSelector.select(task);
    await settled();
    assert.equal(this.element.textContent.trim(), 'true');

    taskSelector.deselect(task);
    await settled();
    assert.equal(this.element.textContent.trim(), 'false');
  });
});
