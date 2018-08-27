export function shouldBeEditing(itemSelector, assert) {
  assert.dom(itemSelector).hasClass('is-editing');
  assert.dom(`${itemSelector} [data-test-task-name]`).doesNotExist();
  assert.dom(`${itemSelector} [data-test-task-name-input]`).exists();
  assert.dom(`${itemSelector} [data-test-task-name-input]`).isFocused();
}

export function shouldNotBeEditing(itemSelector, assert) {
  assert.dom(itemSelector).hasNoClass('is-editing');
  assert.dom(`${itemSelector} [data-test-task-name]`).exists();
  assert.dom(`${itemSelector} [data-test-task-name-input]`).doesNotExist();
}
