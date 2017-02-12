'use strict';

const characters = [
  'Frodo',
  'Sam',
  'Merry',
  'Pippin',
  'Gandolf',
  'Aragorn',
  'Boromir',
  'Legolas',
  'Gimli',
  'Golumn',
].map(name => ({ name }));

const follows = {
  Frodo: ['Sam', 'Gandolf'],
  Sam: ['Frodo'],
  Merry: ['Pippin', 'Frodo'],
  Pippin: ['Merry', 'Frodo'],
  Gandolf: ['Frodo'],
  Aragorn: ['Frodo', 'Gandolf'],
  Boromir: ['Frodo', 'Merry', 'Pippin'],
  Legolas: ['Frodo'],
  Gimli: ['Frodo'],
  Golumn: ['Frodo'],
};

function createFollowModels(customers) {
  const getCustomerId = (name) => customers.find(customer => customer.name === name).id;

  return Object.keys(follows).reduce((models, name) => {
    const followerId = getCustomerId(name);
    const followeeIds = follows[name].map(followee => getCustomerId(followee));
    const newModels = followeeIds.map(followeeId => ({ followeeId, followerId }));
    return models.concat(newModels);
  }, []);
}

module.exports = function(server, done) {
  const { Customer, Follow } = server.models;

  Customer.create(characters)
    .then(customers => Follow.create(createFollowModels(customers)))
    .then(() => {
      console.log('initialized models');
      done(null);
    })
    .catch(done);
};
