import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { spy } from 'sinon';

module('Unit | Service | tags-filter', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(async function() {
    this.service = this.owner.lookup('service:tags-filter');
  });

  test('it has correct default state', function(assert) {
    assert.equal(this.service.isAllTagsMode, true);
    assert.equal(this.service.isNoTagMode, false);
    assert.equal(this.service.hasItems, false);
    assert.equal(this.service.items.length, 0);
  });

  test('enableNoTagMode sets isNoTagMode to true', function(assert) {
    assert.equal(this.service.isNoTagMode, false);

    this.service.enableNoTagMode();
    assert.equal(this.service.isNoTagMode, true);
  });

  test('enableNoTagMode clears selected items', function(assert) {
    this.service.select([{}, {}]);
    assert.equal(this.service.items.length, 2);

    this.service.enableNoTagMode();
    assert.equal(this.service.items.length, 0);
  });

  test('hasItems property works properly', function(assert) {
    assert.equal(this.service.items.length, 0);
    assert.equal(this.service.hasItems, false);

    this.service.select({});
    assert.equal(this.service.items.length, 1);
    assert.equal(this.service.hasItems, true);

    this.service.clear();
    assert.equal(this.service.items.length, 0);
    assert.equal(this.service.hasItems, false);
  });

  test('isAllTagsMode property works properly', function(assert) {
    assert.equal(
      this.service.isAllTagsMode, true,
      'isAllTagsMode is true by default'
    );

    this.service.select({});
    assert.equal(
      this.service.isAllTagsMode, false,
      'isAllTagsMode is false if there are selected items'
    );

    this.service.clear();
    assert.equal(this.service.isAllTagsMode, true);

    this.service.enableNoTagMode();
    assert.equal(
      this.service.isAllTagsMode, false,
      'isAllTagsMode is false if NoTagMode is enabled'
    );

    this.service.disableNoTagMode();
    assert.equal(this.service.isAllTagsMode, true);
  });

  test('disableNoTagMode sets isNoTagMode to false', function(assert) {
    this.service.enableNoTagMode();
    assert.equal(this.service.isNoTagMode, true);

    this.service.disableNoTagMode();
    assert.equal(this.service.isNoTagMode, false);
  });

  test('select adds one item', function(assert) {
    let item = { name: 'item' };
    assert.deepEqual(this.service.items, []);

    this.service.select(item);
    assert.deepEqual(this.service.items, [item]);
  });

  test('select calls disableNoTagMode method', function(assert) {
    this.service.disableNoTagMode = spy();
    this.service.select();
    assert.equal(this.service.disableNoTagMode.calledOnce, true);
  });

  test('select adds multiple items', function(assert) {
    let items = [{ name: 'item 1' }, { name: 'item 2' }];
    assert.deepEqual(this.service.items, []);

    this.service.select(items);
    assert.deepEqual(this.service.items, items);
  });

  test('select does not add selected items', function(assert) {
    let selectedItem = { name: 'item' };
    this.service.select(selectedItem);
    assert.deepEqual(this.service.items, [selectedItem]);

    let itemsToSelect = [selectedItem, { name: 'item 2' }];
    this.service.select(itemsToSelect);
    assert.deepEqual(this.service.items, itemsToSelect);
  });

  test('selectOnly adds one item and remove current ones', function(assert) {
    let selectedItems = [{ name: 'item 1' }, { name: 'item 2' }];
    this.service.select(selectedItems);
    assert.deepEqual(this.service.items, selectedItems);

    let onlyItem = { name: 'only item' };
    this.service.selectOnly(onlyItem);
    assert.deepEqual(this.service.items, [onlyItem]);
  });

  test('selectOnly adds multiple items and remove current ones', function(assert) {
    let selectedItems = [{ name: 'item 1' }, { name: 'item 2' }];
    this.service.select(selectedItems);
    assert.deepEqual(this.service.items, selectedItems);

    let onlyItems = [{ name: 'only item 1' }, { name: 'only item 2' }];
    this.service.selectOnly(onlyItems);
    assert.deepEqual(this.service.items, onlyItems);
  });

  test('deselect removes one selected item from items list', function(assert) {
    let itemToDeselect = { name: 'item 1' };
    let itemToStay = { name: 'item 2' };
    this.service.select([itemToDeselect, itemToStay]);
    assert.deepEqual(this.service.items, [itemToDeselect, itemToStay]);

    this.service.deselect(itemToDeselect);
    assert.deepEqual(this.service.items, [itemToStay]);
  });

  test('deselect removes multiple selected items from items list', function(assert) {
    let itemToDeselect1 = { name: 'item 1' };
    let itemToDeselect2 = { name: 'item 2' };
    let itemToStay = { name: 'item 3' };
    this.service.select([itemToDeselect1, itemToDeselect2, itemToStay]);
    assert.deepEqual(this.service.items, [itemToDeselect1, itemToDeselect2, itemToStay]);

    this.service.deselect([itemToDeselect1, itemToDeselect2]);
    assert.deepEqual(this.service.items, [itemToStay]);
  });

  test('isSelected returns false if item is not selected', function(assert) {
    let item = { name: 'item' };
    assert.equal(this.service.isSelected(item), false);
  });

  test('isSelected returns true if item is selected', function(assert) {
    let item = { name: 'item' };
    this.service.select(item);
    assert.equal(this.service.isSelected(item), true);
  });

  test('clear removes all items from items list', function(assert) {
    let items = [{}, {}];
    this.service.select(items);
    assert.equal(this.service.items.length, 2);

    this.service.clear();
    assert.equal(this.service.items.length, 0);
  });

  test('clear calls disableNoTagMode method', function(assert) {
    this.service.disableNoTagMode = spy();
    this.service.clear();
    assert.equal(this.service.disableNoTagMode.calledOnce, true);
  });

  test('toggle adds one item', function(assert) {
    let itemToSelect = { name: 'item' };
    let selectedItem = { name: 'item' };
    this.service.select(selectedItem);
    assert.deepEqual(this.service.items, [selectedItem]);

    this.service.toggle(itemToSelect);
    assert.deepEqual(this.service.items, [itemToSelect, selectedItem]);
  });

  test('toggle adds multiple items', function(assert) {
    let selectedItem = { name: 'item 1' };
    this.service.select(selectedItem);
    assert.deepEqual(this.service.items, [selectedItem]);

    let itemsToSelect = [{ name: 'item 2' }, { name: 'item 3' }];
    this.service.toggle(itemsToSelect);
    assert.deepEqual(this.service.items, [selectedItem, ...itemsToSelect]);
  });

  test('toggle removes one selected item from items list', function(assert) {
    let itemToDeselect = { name: 'item 1' };
    let itemToStay = { name: 'item 2' };
    this.service.select([itemToDeselect, itemToStay]);
    assert.deepEqual(this.service.items, [itemToDeselect, itemToStay]);

    this.service.toggle(itemToDeselect);
    assert.deepEqual(this.service.items, [itemToStay]);
  });

  test('toggle removes multiple selected items from items list', function(assert) {
    let itemsToDeselect = [{ name: 'item 1' }, { name: 'item 2' }];
    let itemToStay = { name: 'item 3' };
    this.service.select([...itemsToDeselect, itemToStay]);
    assert.deepEqual(this.service.items, [...itemsToDeselect, itemToStay]);

    this.service.toggle(itemsToDeselect);
    assert.deepEqual(this.service.items, [itemToStay]);
  });
});
