import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll, click, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, makeList } from 'ember-data-factory-guy';

module('Integration | Component | tags-filter', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  hooks.beforeEach(async function() {
    this.tags = makeList('tag', { id: 1, name: 'tag 1' }, { id: 2, name: 'tag 2' });
    await render(hbs`{{tags-filter tags=tags}}`);
  });

  test('it renders filter items properly', async function(assert) {
    assert.dom('[data-test-tags-filter-item]').exists({ count: 4 });
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasText('All');
    assert.dom('[data-test-tags-filter-item="1"]').hasText('tag 1');
    assert.dom('[data-test-tags-filter-item="2"]').hasText('tag 2');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasText('No Tag');
  });

  test('it renders filter items in correct order', async function(assert) {
    let [first, second, third, fourth] = findAll('[data-test-tags-filter-item]');
    assert.dom(first).hasText('All');
    assert.dom(second).hasText('tag 1');
    assert.dom(third).hasText('tag 2');
    assert.dom(fourth).hasText('No Tag');
  });

  test('it only renders "all-tags" item as selected by default', async function(assert) {
    assert.dom('[data-test-tags-filter-item].is-selected').exists({ count: 1 });
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');
  });

  test('it selects "all-tags" item on click', async function(assert) {
    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasNoClass('is-selected');
    await click('[data-test-tags-filter-item="all-tags"]');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasNoClass('is-selected');
    await click('[data-test-tags-filter-item="all-tags"]');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');
  });

  test('it selects "all-tags" item on selected tag click with metaKey', async function(assert) {
    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasNoClass('is-selected');

    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown', { metaKey: true });
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');
  });

  test('it does not select "all-tags" item on selected tag click with metaKey if there are more selected tags', async function(assert) {
    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown');
    await triggerEvent('[data-test-tags-filter-item="2"]', 'mousedown', { metaKey: true });
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-filter-item="2"]').hasClass('is-selected');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasNoClass('is-selected');

    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown', { metaKey: true });
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasNoClass('is-selected');
  });

  test('it deselects "all-tags" item on tag click', async function(assert) {
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasNoClass('is-selected');
  });

  test('it deselects "all-tags" item on "no-tags" item click', async function(assert) {
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasNoClass('is-selected');
  });

  test('it does not deselect "all-tags" item on click', async function(assert) {
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="all-tags"]');
    assert.dom('[data-test-tags-filter-item="all-tags"]').hasClass('is-selected');
  });

  test('it selects target tag on click', async function(assert) {
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');
    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="2"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');
    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');
    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');
  });

  test('it selects target tag on click with metaKey', async function(assert) {
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');

    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown', { metaKey: true });
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');
  });

  test('it deselects selected tag on other tag click', async function(assert) {
    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="2"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');
  });

  test('it does not deselect tag on other tag click with metaKey', async function(assert) {
    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-filter-item].is-selected').exists({ count: 1 });

    await triggerEvent('[data-test-tags-filter-item="2"]', 'mousedown', { metaKey: true });
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-filter-item].is-selected').exists({ count: 2 });
  });

  test('it deselects selected tag on "all-tags" item click', async function(assert) {
    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="all-tags"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');
  });

  test('it deselects selected tag on "no-tags" item click', async function(assert) {
    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');
  });

  test('it deselects selected tag on click with metaKey', async function(assert) {
    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');

    await triggerEvent('[data-test-tags-filter-item="1"]', 'mousedown', { metaKey: true });
    assert.dom('[data-test-tags-filter-item="1"]').hasNoClass('is-selected');
  });

  test('it does not deselect selected tag on click', async function(assert) {
    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="1"]').hasClass('is-selected');
  });

  test('it selects "no-tags" item on click', async function(assert) {
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasNoClass('is-selected');

    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasClass('is-selected');
  });

  test('it deselects "no-tags" item on tag click', async function(assert) {
    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="1"]');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasNoClass('is-selected');
  });

  test('it deselects "no-tags" item on "all-tags" item click', async function(assert) {
    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="all-tags"]');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasNoClass('is-selected');
  });

  test('it does not deselect "no-tags" item on click', async function(assert) {
    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasClass('is-selected');

    await click('[data-test-tags-filter-item="no-tags"]');
    assert.dom('[data-test-tags-filter-item="no-tags"]').hasClass('is-selected');
  });
});
