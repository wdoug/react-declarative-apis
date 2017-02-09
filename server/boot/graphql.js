'use strict';
const graphql = require('graphql');
const expressGraphql = require('express-graphql');
const Schema = require('../graphql/schema');

module.exports = function(server) {
  server.use('/graphql', expressGraphql({
    schema: Schema,
    graphiql: true,
  }));
  console.log('graphql api on /graphql');
};
