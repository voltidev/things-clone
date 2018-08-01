import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | actions-bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    this.set('deleteSelected', () => null);
    await render(hbs`{{actions-bar deleteSelected=deleteSelected}}`);
    assert.equal(this.element.textContent.trim(), 'Delete');
  });
});
