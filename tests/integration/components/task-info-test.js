import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | task-info', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      {{task-info
        task=(hash)
        placeholder=''
        isProjectShown=false
        toggleCheckbox=(optional)
      }}
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
