import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('tag', {
  default: { name: ({ id }) => `tag ${id}` },

  traits: {
    default: {}
  }
});
