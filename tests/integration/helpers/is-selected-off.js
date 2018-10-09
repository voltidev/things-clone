import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, make } from 'ember-data-factory-guy';

module('Integration | Helper | is-selected', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  test('it works properly', async function(assert) {
    let itemSelector = this.owner.lookup('service:task-selector');
    let task = make('task');
    this.set('task', task);

    await render(hbs`{{is-selected task}}`);
    assert.equal(this.element.textContent.trim(), 'false');

    itemSelector.select(task);
    await settled();
    assert.equal(this.element.textContent.trim(), 'true');

    itemSelector.deselect(task);
    await settled();
    assert.equal(this.element.textContent.trim(), 'false');
  });
});
