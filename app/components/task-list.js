import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  taskSelector: service(),
  tasks: null,

  actions: {
    selectBetween(clickedTask) {
      this.taskSelector.select(clickedTask);
      let selectedTasks = this.taskSelector.sortedTasks;
      let firstTask = selectedTasks.firstObject;
      let lastTask = clickedTask !== firstTask ? clickedTask : selectedTasks.lastObject;

      this.taskSelector.selectOnly(
        ...this.tasks.filter(({ order }) => order >= firstTask.order && order <= lastTask.order)
      );
    }
  }
});
