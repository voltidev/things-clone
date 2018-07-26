import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, triggerEvent, triggerKeyEvent, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { spy } from 'sinon';
import { shouldBeEditing, shouldNotBeEditing } from '../../helpers/editing-mode';

function renderComponent() {
  return render(hbs`
    {{task-item
      task=task
      saveTask=saveTask
      completeTask=completeTask
      uncompleteTask=uncompleteTask
      data-test-task=true
    }}
  `);
}

module('Integration | Component | task-item', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.task = { id: 1, name: 'task', isComplete: false };
    this.set('task', this.task);
    this.set('saveTask', () => null);
    this.set('completeTask', () => null);
    this.set('uncompleteTask', () => null);
  });

  test('it renders task name', async function(assert) {
    let taskName = 'new task';
    this.task.name = taskName;
    await renderComponent();
    assert.dom('[data-test-task-name]').hasText(taskName);
  });

  test('it renders placeholder when name is empty', async function(assert) {
    let placeholder = 'New To-Do';
    this.task.name = '';
    await renderComponent();
    assert.dom('[data-test-task-name]').hasText(placeholder);
  });

  test('it sets correct checkbox and label id', async function(assert) {
    this.task.id = 99;
    let checkboxId = 'task-checkbox-99';
    await renderComponent();
    assert.dom('[data-test-task-checkbox]').hasAttribute('id', checkboxId);
    assert.dom('[data-test-task-checkbox-label]').hasAttribute('for', checkboxId);
  });

  test('it links checkbox label to checkbox', async function(assert) {
    await renderComponent();
    assert.dom('[data-test-task-checkbox]').isNotChecked();

    await click('[data-test-task-checkbox-label]');
    assert.dom('[data-test-task-checkbox]').isChecked();

    await click('[data-test-task-checkbox-label]');
    assert.dom('[data-test-task-checkbox]').isNotChecked();
  });

  test('it renders complete task properly', async function(assert) {
    this.task.isComplete = true;
    await renderComponent();
    assert.dom('[data-test-task-checkbox]').isChecked();
    assert.dom('[data-test-task]').hasClass('is-complete');
  });

  test('it renders incomplete task properly', async function(assert) {
    this.task.isComplete = false;
    await renderComponent();
    assert.dom('[data-test-task-checkbox]').isNotChecked();
    assert.dom('[data-test-task]').hasNoClass('is-complete');
  });

  test('it is not selected by default', async function(assert) {
    await renderComponent();
    assert.dom('[data-test-task]').hasNoClass('is-selected');
  });

  test('it is selected after click', async function(assert) {
    await renderComponent();
    assert.dom('[data-test-task]').hasNoClass('is-selected');

    await click('[data-test-task]');
    assert.dom('[data-test-task]').hasClass('is-selected');
  });

  test('it deselect other tasks on click', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let otherTask = {};

    await renderComponent();
    taskSelector.select(otherTask);
    assert.ok(taskSelector.isSelected(otherTask), 'before click other task is selected');
    assert.notOk(taskSelector.isSelected(this.task), 'before click target task is not selected');

    await triggerEvent('[data-test-task]', 'click');
    assert.notOk(
      taskSelector.isSelected(otherTask),
      'after click other task is not selected anymore'
    );
    assert.ok(taskSelector.isSelected(this.task), 'after click target task is selected');
  });

  test('it does not deselect other tasks on click with metaKey', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    let otherTask = {};

    await renderComponent();
    taskSelector.select(otherTask);
    assert.ok(taskSelector.isSelected(otherTask), 'before click other task is selected');
    assert.notOk(taskSelector.isSelected(this.task), 'before click target task is not selected');

    await triggerEvent('[data-test-task]', 'click', { metaKey: true });
    assert.ok(taskSelector.isSelected(otherTask), 'after click other task is still selected');
    assert.ok(taskSelector.isSelected(this.task), 'after click target task is selected too');
  });

  test('it is not selected on checkbox or label click', async function(assert) {
    await renderComponent();
    await click('[data-test-task-checkbox]');
    assert.dom('[data-test-task]').hasNoClass('is-selected');

    await click('[data-test-task-checkbox-label]');
    assert.dom('[data-test-task]').hasNoClass('is-selected');
  });

  test('it updates when taskSelector state changes', async function(assert) {
    let taskSelector = this.owner.lookup('service:task-selector');
    await renderComponent();
    assert.dom('[data-test-task]').hasNoClass('is-selected');

    taskSelector.select(this.task);
    await settled();
    assert.dom('[data-test-task]').hasClass('is-selected');

    taskSelector.deselect(this.task);
    await settled();
    assert.dom('[data-test-task]').hasNoClass('is-selected');
  });

  test('it calls completeTask action on checkbox click', async function(assert) {
    let completeTask = spy();
    this.set('completeTask', completeTask);
    this.task.isComplete = false;
    await renderComponent();
    await click('[data-test-task-checkbox]');
    assert.ok(completeTask.calledOnceWith(this.task));
  });

  test('it calls uncompleteTask action on checkbox click', async function(assert) {
    let uncompleteTask = spy();
    this.set('uncompleteTask', uncompleteTask);
    this.task.isComplete = true;
    await renderComponent();
    await click('[data-test-task-checkbox]');
    assert.ok(uncompleteTask.calledOnceWith(this.task));
  });

  test('it is not editing by default', async function(assert) {
    await renderComponent();
    shouldNotBeEditing('[data-test-task]', assert);
  });

  test('it renders editing mode properly', async function(assert) {
    let taskName = 'new task';
    this.task.name = taskName;
    this.owner.lookup('service:task-editor').edit(this.task);
    await settled();
    await renderComponent();

    shouldBeEditing('[data-test-task]', assert);
    assert.dom('[data-test-task-name-input]').hasValue(taskName);
  });

  test('it starts editing on double click', async function(assert) {
    await renderComponent();
    shouldNotBeEditing('[data-test-task]', assert);

    await triggerEvent('[data-test-task]', 'dblclick');
    shouldBeEditing('[data-test-task]', assert);
  });

  test('it stops editing on Enter', async function(assert) {
    this.owner.lookup('service:task-editor').edit(this.task);
    await settled();
    await renderComponent();
    shouldBeEditing('[data-test-task]', assert);

    await triggerKeyEvent('[data-test-task-name-input]', 'keyup', 'Enter');
    shouldNotBeEditing('[data-test-task]', assert);
  });

  test('it stops editing on Escape', async function(assert) {
    this.owner.lookup('service:task-editor').edit(this.task);
    await settled();
    await renderComponent();
    shouldBeEditing('[data-test-task]', assert);

    await triggerKeyEvent('[data-test-task-name-input]', 'keyup', 'Escape');
    shouldNotBeEditing('[data-test-task]', assert);
  });

  test('it stops editing on side click', async function(assert) {
    this.owner.lookup('service:task-editor').edit(this.task);
    await settled();
    await renderComponent();
    shouldBeEditing('[data-test-task]', assert);

    await click(document.body);
    shouldNotBeEditing('[data-test-task]', assert);
  });
});
