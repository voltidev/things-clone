import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | project-form', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`
      {{project-form
        project=(hash)
        setProjectName=(optional)
        setProjectNotes=(optional)
        markProjectAsCompleted=(optional)
        markProjectAsNew=(optional)
        deleteProject=(optional)
        undeleteProject=(optional)
        setProjectWhen=(optional)
        setProjectDeadline=(optional)
      }}
    `);

    assert.equal(this.element.textContent.trim(), '');
  });
});
