import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, fillIn, find, focus, triggerKeyEvent, click, blur } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupFactoryGuy, makeList, make } from 'ember-data-factory-guy';
import stubService from '../../helpers/stub-service';

function moveCaretToStart(selector) {
  let element = find(selector);
  element.selectionStart = 0;
  element.selectionEnd = 0;
}

module('Integration | Component | tags-field', function(hooks) {
  setupRenderingTest(hooks);
  setupFactoryGuy(hooks);

  hooks.beforeEach(async function() {
    stubService('data', { tags: makeList('tag', 4) });
    this.dataService = this.owner.lookup('service:data');

    this.itemTags = this.dataService.tags.slice(0, 2);
    this.addTag = tag => this.itemTags.addObject(tag);
    this.removeTag = tag => this.itemTags.removeObject(tag);
    this.createTag = name => make('tag', { name });

    await render(hbs`
      {{tags-field
        itemTags=itemTags
        addTag=addTag
        removeTag=removeTag
        createTag=createTag
      }}
    `);
  });

  // Tags list tests

  test('it renders tags properly', async function(assert) {
    assert.dom('[data-test-tags-field-tag]').exists({ count: 2 });
    assert.dom('[data-test-tags-field-tag="1"]').hasText('tag 1');
    assert.dom('[data-test-tags-field-tag="2"]').hasText('tag 2');
  });

  test('it selects tag on click', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
  });

  test('it selects last tag on input ArrowLeft if caret is at start', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
  });

  test('it does not select last tag on input ArrowLeft if caret is not at start', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await fillIn('[data-test-tags-field-input]', 'text');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
  });

  test('it selects last tag on input ArrowLeft if caret is moved to start', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await fillIn('[data-test-tags-field-input]', 'text');
    moveCaretToStart('[data-test-tags-field-input]');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
  });

  test('it selects last tag on input Backspace if caret is at start', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
  });

  test('it does not select last tag on input Backspace if caret is not at start', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await fillIn('[data-test-tags-field-input]', 'text');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
  });

  test('it selects last tag on input Backspace if caret is moved to start', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await fillIn('[data-test-tags-field-input]', 'text');
    moveCaretToStart('[data-test-tags-field-input]');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
  });

  test('it deselects tag on Enter', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await triggerKeyEvent(this.element, 'keydown', 'Enter');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
  });

  test('it removes tag on remove click', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').exists();
    assert.dom('[data-test-tags-field-tag="2"]').exists();

    await click('[data-test-tags-field-tag="1"] [data-test-tags-field-remove]');
    assert.dom('[data-test-tags-field-tag="1"]').doesNotExist();
    assert.dom('[data-test-tags-field-tag="2"]').exists();
  });

  test('it selects next tag if removed tag is selected', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await click('[data-test-tags-field-tag="1"] [data-test-tags-field-remove]');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
  });

  test('it does not select next tag if removed tag is not selected', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await click('[data-test-tags-field-tag="1"] [data-test-tags-field-remove]');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
  });

  test('it removes selected tag on Backspace', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="1"]').exists();
    assert.dom('[data-test-tags-field-tag="2"]').exists();

    await triggerKeyEvent(this.element, 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-tag="1"]').doesNotExist();
    assert.dom('[data-test-tags-field-tag="2"]').exists();

    await click('[data-test-tags-field-tag="2"]');
    await triggerKeyEvent(this.element, 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-tag="2"]').doesNotExist();
  });

  test('it does not remove unselected tags on Backspace', async function(assert) {
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
    assert.dom('[data-test-tags-field-tag="1"]').exists();
    assert.dom('[data-test-tags-field-tag="2"]').exists();

    await triggerKeyEvent(this.element, 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-tag="1"]').exists();
    assert.dom('[data-test-tags-field-tag="2"]').exists();
  });

  test('it selects next tag when selected tag is removed with Backspace', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await triggerKeyEvent(this.element, 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
  });

  test('it selects previous tag on ArrowLeft', async function(assert) {
    await click('[data-test-tags-field-tag="2"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');

    await triggerKeyEvent(this.element, 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
  });

  test('it deselects selected tag on ArrowLeft', async function(assert) {
    await click('[data-test-tags-field-tag="2"]');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');

    await triggerKeyEvent(this.element, 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
  });

  test('it does not deselect selected tag on ArrowLeft if no previous tag', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');

    await triggerKeyEvent(this.element, 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
  });

  test('it selects next tag on ArrowRight', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');

    await triggerKeyEvent(this.element, 'keydown', 'ArrowRight');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
  });

  test('it deselects selected tag on ArrowRight', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');
    await triggerKeyEvent(this.element, 'keydown', 'ArrowRight');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');

    await click('[data-test-tags-field-tag="2"]');
    assert.dom('[data-test-tags-field-tag="2"]').hasClass('is-selected');
    await triggerKeyEvent(this.element, 'keydown', 'ArrowRight');
    assert.dom('[data-test-tags-field-tag="2"]').hasNoClass('is-selected');
  });

  test('it deselects selected tag on Tab', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag].is-selected').exists({ count: 1 });

    await triggerKeyEvent(this.element, 'keydown', 'Tab');
    assert.dom('[data-test-tags-field-tag].is-selected').doesNotExist();
  });

  test('it deselects selected tag on Tab + Shift', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag].is-selected').exists({ count: 1 });

    await triggerKeyEvent(this.element, 'keydown', 'Tab', { shiftKey: true });
    assert.dom('[data-test-tags-field-tag].is-selected').doesNotExist();
  });

  test('it deselects selected tag on outside click', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');

    await click(this.element);
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
  });

  test('it deselects selected tag on input focus', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').hasClass('is-selected');

    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-tag="1"]').hasNoClass('is-selected');
  });

  // Input tests

  test('it focuses input on ArrowRight if last tag is selected', async function(assert) {
    await click('[data-test-tags-field-tag="2"]');
    assert.dom('[data-test-tags-field-input]').isNotFocused();

    await triggerKeyEvent(this.element, 'keydown', 'ArrowRight');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it does not focus input on ArrowRight if last tag is not selected', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-input]').isNotFocused();

    await triggerKeyEvent(this.element, 'keydown', 'ArrowRight');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it focuses input on Backspace if last tag is selected', async function(assert) {
    await click('[data-test-tags-field-tag="2"]');
    assert.dom('[data-test-tags-field-input]').isNotFocused();

    await triggerKeyEvent(this.element, 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it does not focus input on Backspace if last tag is not selected', async function(assert) {
    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-input]').isNotFocused();

    await triggerKeyEvent(this.element, 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it clears input value on Escape', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-input]').hasValue('text');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Escape');
    assert.dom('[data-test-tags-field-input]').hasValue('');
  });

  test('it blurs input on Escape if value is empty', async function(assert) {
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Escape');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it does not blur input on Escape if value is not empty', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Escape');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it blurs input on Enter if value is empty', async function(assert) {
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it does not blur input on Enter if value is not empty', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it blurs input on ArrowLeft if caret is at start', async function(assert) {
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it does not blur input on ArrowLeft if caret is at start but no tags', async function(assert) {
    this.set('itemTags', []);
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it does not blur input on ArrowLeft if caret is not at start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it blurs input on ArrowLeft if caret is moved to start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-input]').isFocused();

    moveCaretToStart('[data-test-tags-field-input]');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it blurs input on Backspace if caret is at start', async function(assert) {
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it does not blur input on Backspace if caret is at start but no tags', async function(assert) {
    this.set('itemTags', []);
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it does not blur input on Backspace if caret is not at start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-input]').isFocused();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it blurs input on Backspace if caret is moved to start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-input]').isFocused();

    moveCaretToStart('[data-test-tags-field-input]');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-input]').isNotFocused();
  });

  test('it focuses input on tag option click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    await blur('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isNotFocused();

    await click('[data-test-tags-field-option="3"]');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  test('it focuses input on create option click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    await blur('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-input]').isNotFocused();

    await click('[data-test-tags-field-option="create"]');
    assert.dom('[data-test-tags-field-input]').isFocused();
  });

  // Options
  test('it shows options on input focus if value is not empty', async function(assert) {
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-option]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-option]').exists();
  });

  test('it does not show options on input focus if value is empty', async function(assert) {
    await focus('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-option]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', ' ');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it hides options if input value gets empty', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-option]').exists();
    await fillIn('[data-test-tags-field-input]', '');
    assert.dom('[data-test-tags-field-option]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-option]').exists();
    await fillIn('[data-test-tags-field-input]', '  ');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it does not hide options on input focus out', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-option]').exists();

    await blur('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-option]').exists();
  });

  test('it hides options on any option click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists();
    await click('[data-test-tags-field-option="3"]');
    assert.dom('[data-test-tags-field-option]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists();
    await click('[data-test-tags-field-option="create"]');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it hides options on Enter with any option', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option="3"]').hasClass('is-active');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-option]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', 'new');
    assert.dom('[data-test-tags-field-option="create"]').hasClass('is-active');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it hides options on tag click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists();

    await click('[data-test-tags-field-tag="1"]');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it hides options on input ArrowLeft if caret is at start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    moveCaretToStart('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-option]').exists();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it does not hide options on input ArrowLeft if caret is not at start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowLeft');
    assert.dom('[data-test-tags-field-option]').exists();
  });

  test('it hides options on input Backspace if caret is at start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    moveCaretToStart('[data-test-tags-field-input]');
    assert.dom('[data-test-tags-field-option]').exists();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it does not hide options on input Backspace if caret is not at start', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Backspace');
    assert.dom('[data-test-tags-field-option]').exists();
  });

  test('it hides options on input Tag', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'Tab');
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it hides options on outside click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists();

    await click(this.element);
    assert.dom('[data-test-tags-field-option]').doesNotExist();
  });

  test('it shows active "create tag" option with input value if no tags', async function(assert) {
    assert.dom('[data-test-tags-field-option]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', 'text');
    assert.dom('[data-test-tags-field-option]').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option]').hasClass('is-active');
    assert.dom('[data-test-tags-field-option]').hasText('text');
  });

  test('it only shows tag options that starts with input value', async function(assert) {
    assert.dom('[data-test-tags-field-option]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option]').exists({ count: 3 });
    assert.dom('[data-test-tags-field-option="3"]').exists();
    assert.dom('[data-test-tags-field-option="4"]').exists();

    await fillIn('[data-test-tags-field-input]', '  tag  ');
    assert.dom('[data-test-tags-field-option]').exists({ count: 3 });
    assert.dom('[data-test-tags-field-option="3"]').exists();
    assert.dom('[data-test-tags-field-option="4"]').exists();

    await fillIn('[data-test-tags-field-input]', 'tag 4');
    assert.dom('[data-test-tags-field-option]').exists({ count: 2 });
    assert.dom('[data-test-tags-field-option="3"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="4"]').exists();

    await fillIn('[data-test-tags-field-input]', '  tag 4  ');
    assert.dom('[data-test-tags-field-option]').exists({ count: 2 });
    assert.dom('[data-test-tags-field-option="3"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="4"]').exists();

    await fillIn('[data-test-tags-field-input]', 'wrong');
    assert.dom('[data-test-tags-field-option]').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="3"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="4"]').doesNotExist();
  });

  test('it only shows suitable tag options that are not yet in tags list', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'ta');
    assert.dom('[data-test-tags-field-tag="1"]').exists();
    assert.dom('[data-test-tags-field-option="1"]').doesNotExist();

    await click('[data-test-tags-field-tag="1"] [data-test-tags-field-remove]');
    assert.dom('[data-test-tags-field-tag="1"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="1"]').exists();

    await click('[data-test-tags-field-option="1"]');
    assert.dom('[data-test-tags-field-tag="1"]').exists();
    assert.dom('[data-test-tags-field-option="1"]').doesNotExist();
  });

  test('it only renders top option as active by default', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="3"]').hasClass('is-active');

    await fillIn('[data-test-tags-field-input]', 'tag 4');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="4"]').hasClass('is-active');

    await fillIn('[data-test-tags-field-input]', 'wrong');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="create"]').hasClass('is-active');
  });

  test('it makes next option active on input ArrowDown', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="3"]').hasClass('is-active');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowDown');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="4"]').hasClass('is-active');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowDown');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="create"]').hasClass('is-active');
  });

  test('it makes previous option active on input ArrowUp', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowDown');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowDown');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="create"]').hasClass('is-active');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowUp');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="4"]').hasClass('is-active');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowUp');
    assert.dom('[data-test-tags-field-option].is-active').exists({ count: 1 });
    assert.dom('[data-test-tags-field-option="3"]').hasClass('is-active');
  });

  test('it adds tag to tags list on tag option click', async function(assert) {
    assert.dom('[data-test-tags-field-tag="3"]').doesNotExist();
    await fillIn('[data-test-tags-field-input]', 'tag');
    await click('[data-test-tags-field-option="3"]');
    assert.dom('[data-test-tags-field-tag="3"]').exists();

    assert.dom('[data-test-tags-field-tag="4"]').doesNotExist();
    await fillIn('[data-test-tags-field-input]', 'tag');
    await click('[data-test-tags-field-option="4"]');
    assert.dom('[data-test-tags-field-tag="4"]').exists();
  });

  test('it removes tag option on click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option="3"]').exists();
    assert.dom('[data-test-tags-field-option="4"]').exists();

    await click('[data-test-tags-field-option="3"]');
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option="3"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="4"]').exists();
  });

  test('it clears input value on tag option click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-input]').hasValue('tag');

    await click('[data-test-tags-field-option="3"]');
    assert.dom('[data-test-tags-field-input]').hasValue('');
  });

  test('it adds active tag option to tags list on input Enter', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    await triggerKeyEvent('[data-test-tags-field-input]', 'keydown', 'ArrowDown');
    assert.dom('[data-test-tags-field-option="4"]').hasClass('is-active');
    assert.dom('[data-test-tags-field-tag="4"]').doesNotExist();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-tag="4"]').exists();

    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option="3"]').hasClass('is-active');
    assert.dom('[data-test-tags-field-tag="3"]').doesNotExist();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-tag="3"]').exists();
  });

  test('it removes active tag option on input Enter', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option="3"]').hasClass('is-active');
    assert.dom('[data-test-tags-field-option="4"]').exists();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-option="3"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="4"]').exists();
  });

  test('it clears input value on tag option Enter', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag');
    assert.dom('[data-test-tags-field-input]').hasValue('tag');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-input]').hasValue('');
  });

  test('it adds new tag to tags list on create option click', async function(assert) {
    assert.dom('[data-test-tags-field-tag="5"]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', '  new tag   ');
    await click('[data-test-tags-field-option="create"]');
    assert.dom('[data-test-tags-field-tag="5"]').exists();
    assert.dom('[data-test-tags-field-tag="5"]').hasText('new tag');
  });

  test('it clears input value on create option click', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'new tag');
    assert.dom('[data-test-tags-field-input]').hasValue('new tag');

    await click('[data-test-tags-field-option="create"]');
    assert.dom('[data-test-tags-field-input]').hasValue('');
  });

  test('it adds new tag to tags list on create option Enter', async function(assert) {
    assert.dom('[data-test-tags-field-tag="5"]').doesNotExist();

    await fillIn('[data-test-tags-field-input]', 'new tag');
    assert.dom('[data-test-tags-field-option="create"]').hasClass('is-active');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-tag="5"]').exists();
    assert.dom('[data-test-tags-field-tag="5"]').hasText('new tag');
  });

  test('it clears input value on create option Enter', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'new tag');
    assert.dom('[data-test-tags-field-input]').hasValue('new tag');
    assert.dom('[data-test-tags-field-option="create"]').hasClass('is-active');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-input]').hasValue('');
  });

  test('it does not create tag on create option click if name is not unique', async function(assert) {
    assert.dom('[data-test-tags-field-tag]').exists({ count: 2 });

    await fillIn('[data-test-tags-field-input]', 'tag 1');
    await click('[data-test-tags-field-option="create"]');
    assert.dom('[data-test-tags-field-tag]').exists({ count: 2 });
    assert.dom('[data-test-tags-field-input]').hasValue('');
  });

  test('it adds tag to tag list on create option click if input equals any tag option\'s name', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag 3');
    assert.dom('[data-test-tags-field-tag="3"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="3"]').exists();

    await click('[data-test-tags-field-option="create"]');
    await fillIn('[data-test-tags-field-input]', 'tag 3');
    assert.dom('[data-test-tags-field-tag="3"]').exists();
    assert.dom('[data-test-tags-field-option="3"]').doesNotExist();
  });

  test('it does not create tag on create option Enter if name is not unique', async function(assert) {
    assert.dom('[data-test-tags-field-tag]').exists({ count: 2 });

    await fillIn('[data-test-tags-field-input]', 'tag 1');
    assert.dom('[data-test-tags-field-option="create"]').hasClass('is-active');

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    assert.dom('[data-test-tags-field-tag]').exists({ count: 2 });
    assert.dom('[data-test-tags-field-input]').hasValue('');
  });

  test('it adds tag to tag list on create option click if input equals any tag option\'s name', async function(assert) {
    await fillIn('[data-test-tags-field-input]', 'tag 3');
    assert.dom('[data-test-tags-field-tag="3"]').doesNotExist();
    assert.dom('[data-test-tags-field-option="3"]').exists();

    await triggerKeyEvent('[data-test-tags-field-input]', 'keyup', 'Enter');
    await fillIn('[data-test-tags-field-input]', 'tag 3');
    assert.dom('[data-test-tags-field-tag="3"]').exists();
    assert.dom('[data-test-tags-field-option="3"]').doesNotExist();
  });
});
