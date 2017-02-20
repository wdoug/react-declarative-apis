'use strict';
const expressGraphql = require('express-graphql');
const { buildSchema } = require('graphql');

module.exports = function(server) {
  const CustomerModel = server.models.Customer;
  const FollowModel = server.models.Follow;

  const schema = buildSchema(`
    type Customer {
      id: Int!,
      name: String,
      followers: FollowerConnection!
    }

    type FollowerConnection {
      edges: [CustomerEdge]!
    }

    type CustomerEdge {
      node: Customer
    }

    type Query {
      customers: [Customer]!
      getCustomer(id: Int!): Customer
    }

    type Mutation {
      follow(id: Int!, signedInId: Int!): Customer
    }
  `);

  class Customer {
    constructor({ id, name }) {
      this.id = id;
      this.name = name;
    }

    followers() {
      const Followers = FollowModel.find({ where: { followeeId: this.id }, include: 'follower' });
      return {
        edges: Followers.map(followerData => ({
          node: followerData.follower.getAsync().then(c => new Customer(c))
        }))
      };
    }
  }

  const rootValue = {
    customers() {
      return CustomerModel.all().map(c => new Customer(c));
    },
    getCustomer(args) {
      const id = args.id;
      return CustomerModel.findOne({ where: { id } }).then(c => new Customer(c));
    },
    follow(args) {
      const signedInUserPromise = CustomerModel.findOne({ where: { id: args.signedInId }});
      const otherUserPromise = CustomerModel.findOne({ where: { id: args.id }});
      return Promise.all([
        signedInUserPromise,
        otherUserPromise
      ]).then(([signedInUser, otherUser]) => {
        return otherUser.followers.add(signedInUser).then(() => otherUser);
      }).then(otherUser => new Customer(otherUser));
    }
  };

  server.use('/graphql', expressGraphql({
    schema,
    rootValue,
    graphiql: true,
  }));

  console.log('graphql api on http://0.0.0.0:3001/graphql');
};
