import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('task', {
  default: {
    name: ({ id }) => `task ${id}`,
    order: ({ id }) => id - 1
  },

  traits: {
    default: {},

    completed: {
      isCompleted: true
    }
  }
});
