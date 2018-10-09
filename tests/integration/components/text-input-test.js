import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | text-input', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      {{text-input
        class="text-input-class"
        id="text-input-id"
        value=""
        placeholder=""
        autoresize=true
        update=(optional)
        enter=(optional)
        escape-press=(optional)
      }}
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
