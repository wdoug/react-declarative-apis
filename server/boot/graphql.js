'use strict';
const graphql = require('graphql');
const expressGraphql = require('express-graphql');
const createSchema = require('../graphql/createSchema');

module.exports = function(server) {
  server.use('/graphql', expressGraphql({
    schema: createSchema(server),
    graphiql: true,
  }));
  console.log('graphql api on http://0.0.0.0:3001/graphql');
};
