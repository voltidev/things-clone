export function shouldBeEditing(taskSelector, assert) {
  assert.dom(taskSelector).hasClass('is-editing');
  assert.dom(`${taskSelector} [data-test-task-name]`).doesNotExist();
  assert.dom(`${taskSelector} [data-test-task-name-input]`).exists();
  assert.dom(`${taskSelector} [data-test-task-name-input]`).isFocused();
}

export function shouldNotBeEditing(taskSelector, assert) {
  assert.dom(taskSelector).hasNoClass('is-editing');
  assert.dom(`${taskSelector} [data-test-task-name]`).exists();
  assert.dom(`${taskSelector} [data-test-task-name-input]`).doesNotExist();
}
