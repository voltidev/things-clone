import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, make } from 'ember-data-factory-guy';
import { spy } from 'sinon';
import stubService from '../../helpers/stub-service';

module('Integration | Component | tags-filter-item', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  hooks.beforeEach(async function() {
    this.tag = make('tag', { id: 1, name: 'tag 1' });
  });

  test('it renders properly', async function(assert) {
    await render(hbs`
      {{tags-filter-item
        item=tag
        data-test-tags-filter-item=true
      }}
    `);

    assert.dom('[data-test-tags-filter-item]').hasText('tag 1');
  });

  test('it is not selected by default', async function(assert) {
    await render(hbs`
      {{tags-filter-item
        item=tag
        data-test-tags-filter-item=true
      }}
    `);

    assert.dom('[data-test-tags-filter-item]').hasNoClass('is-selected');
  });

  test('it is selected if tags-filter service isSelected returns true', async function(assert) {
    stubService('tags-filter', { isSelected: () => true });

    await render(hbs`
      {{tags-filter-item
        item=tag
        data-test-tags-filter-item=true
      }}
    `);

    assert.dom('[data-test-tags-filter-item]').hasClass('is-selected');
  });

  test('it calls selectItem action on click', async function(assert) {
    this.selectItem = spy();
    this.toggleItem = () => null;

    await render(hbs`
      {{tags-filter-item
        item=tag
        selectItem=selectItem
        toggleItem=toggleItem
        data-test-tags-filter-item=true
      }}
    `);

    await triggerEvent('[data-test-tags-filter-item]', 'mousedown');
    assert.ok(this.selectItem.calledOnceWith(this.tag), 'selectItem is called once');
  });

  test('it does not call selectItem action on click with metaKey', async function(assert) {
    this.selectItem = spy();
    this.toggleItem = () => null;

    await render(hbs`
      {{tags-filter-item
        item=tag
        selectItem=selectItem
        toggleItem=toggleItem
        data-test-tags-filter-item=true
      }}
    `);

    await triggerEvent('[data-test-tags-filter-item]', 'mousedown', { metaKey: true });
    assert.ok(this.selectItem.notCalled, 'selectItem is not called');
  });

  test('it calls toggleItem action on click with metaKey', async function(assert) {
    this.selectItem = () => null;
    this.toggleItem = spy();

    await render(hbs`
      {{tags-filter-item
        item=tag
        selectItem=selectItem
        toggleItem=toggleItem
        data-test-tags-filter-item=true
      }}
    `);

    await triggerEvent('[data-test-tags-filter-item]', 'mousedown', { metaKey: true });
    assert.ok(this.toggleItem.calledOnceWith(this.tag), 'toggleItem is called once');
  });

  test('it does not call toggleItem action on click without metaKey', async function(assert) {
    this.selectItem = () => null;
    this.toggleItem = spy();

    await render(hbs`
      {{tags-filter-item
        item=tag
        selectItem=selectItem
        toggleItem=toggleItem
        data-test-tags-filter-item=true
      }}
    `);

    await triggerEvent('[data-test-tags-filter-item]', 'mousedown');
    assert.ok(this.toggleItem.notCalled, 'toggleItem is not called');
  });
});
