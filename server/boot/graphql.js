'use strict';
const expressGraphql = require('express-graphql');
// const createSchema = require('../graphql/createSchema');
const { buildSchema } = require('graphql');

module.exports = function(server) {
  // server.use('/graphql', expressGraphql({
  //   schema: createSchema(server),
  //   graphiql: true,
  // }));

  const schema = buildSchema(`
    type Customer {
      id: ID!,
      name: String,
      followers: FollowerConnection
    }

    type FollowerConnection {
      edges: [CustomerEdge]
    }

    type CustomerEdge {
      node: Customer
    }

    type Query {
      customers: [Customer]
    }
  `);

  class Customer {
    constructor({ id, name }) {
      this.id = id;
      this.name = name;
    }

    followers() {
      const Followers = server.models.Follow.find({ where: { followeeId: this.id }, include: 'follower' });
      console.log('id', this.id);
      // Followers.then(f => console.log('f', f));
      Followers.map(f => ({ node: f.follower.getAsync() })).then(r => console.log(r));
      // console.log('Followers', Followers);
      return {
        // edges: [{
        //   node: {}
        // }]
        edges: Followers.map(followerData => ({
          node: followerData.follower.getAsync().then(c => new Customer(c))
        }))
      };
    }
  }

  const rootValue = {
    customers() {
      const custs = server.models.Customer.all();
      console.log('custs', custs);
      return custs.map(c => new Customer(c));
    },

  };

  server.use('/graphql', expressGraphql({
    schema,
    rootValue,
    graphiql: true,
  }));

  console.log('graphql api on http://0.0.0.0:3001/graphql');
};
