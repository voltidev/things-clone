import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { on } from '@ember/object/evented';
import { EKMixin, EKOnInsertMixin, keyUp } from 'ember-keyboard';
import velocity from 'velocity-animate';

function hideElements(elements) {
  velocity(elements, { opacity: 0 }, { duration: 100 });
  return velocity(elements, { height: 0 }, { duration: 200, easing: 'easeOutCubic' });
}

export default Component.extend(EKMixin, EKOnInsertMixin, {
  taskEditor: service(),
  taskSelector: service(),

  shortcutEditSelected: on(keyUp('Enter'), function() {
    if (!this.taskSelector.hasTasks) {
      return;
    }

    let taskToEdit = this.taskSelector.sortedTasks.firstObject;
    this.taskEditor.edit(taskToEdit);
    this.taskSelector.selectOnly(taskToEdit);
  }),

  shortcutDeleteSelected: on(keyUp('Backspace'), function() {
    if (!this.taskSelector.hasTasks) {
      return;
    }

    hideElements(document.querySelectorAll('.is-selected .js-task')).then(() => {
      this.deleteTasks(this.taskSelector.tasks);
      this.taskSelector.clear();
    });
  })
});
