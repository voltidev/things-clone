import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | subtasks-item', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      {{subtasks-item
        item=(hash)
        editingItem=(hash)
        toggleItem=(optional)
        edit=(optional)
        clearEditor=(optional)
        createItemUnder=(optional)
        deleteItem=(optional)
        editItemAbove=(optional)
      }}
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
