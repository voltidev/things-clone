import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | app-main', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      {{#app-main
        hasContent=false
        folder="inbox"
        as |selectBetween|
      }}
        template block text
      {{/app-main}}
    `);

    assert.notEqual(this.element.textContent.trim(), 'template block text');
  });
});
