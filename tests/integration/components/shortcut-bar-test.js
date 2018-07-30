import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | shortcut-bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('toggleShortcutBar', () => null);
    await render(hbs`{{shortcut-bar close=toggleShortcutBar}}`);
    assert.notEqual(this.element.textContent.trim(), '');
  });
});
