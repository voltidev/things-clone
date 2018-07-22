import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { sandbox as sinonSandBox } from 'sinon';

module('Unit | Model | task', function(hooks) {
  setupTest(hooks);
  let sandbox;
  let now = new Date('07/22/2018');

  hooks.beforeEach(() => {
    sandbox = sinonSandBox.create({
      useFakeTimers: {
        now,
        toFake: ['Date']
      }
    });
  });

  hooks.afterEach(() => {
    sandbox.restore();
  });

  test('complete method works', function(assert) {
    let store = this.owner.lookup('service:store');
    let task = store.createRecord('task', {});

    assert.equal(task.isComplete, false);
    assert.notOk(task.completedAt, 'completedAt is not set by default');

    task.complete();
    assert.equal(task.isComplete, true);
    assert.ok(task.completedAt, 'completedAt is set after complete');
    assert.equal(task.completedAt.getTime(), now.getTime());
  });

  test('uncomplete method works', function(assert) {
    let store = this.owner.lookup('service:store');
    let task = store.createRecord('task', {});

    task.complete();
    assert.equal(task.isComplete, true);

    task.uncomplete();
    assert.equal(task.isComplete, false);
  });
});
