'use strict';
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  // GraphQLFloat,
  // GraphQLEnumType,
  GraphQLNonNull,
} = require('graphql');

module.exports = function(server) {
  const Todo = new GraphQLObjectType({
    name: 'Todo',
    description: 'Represent the type of a todo',
    fields: () => ({
      id: {type: GraphQLInt},
      content: {type: GraphQLString},
    })
  });

  const FollowerConnection = new GraphQLObjectType({
    name: 'FollowerConnection',
    fields: () => ({
      edges: {
        type: GraphQLList(Customer)
      },
      resolve(parent, args, info) {

      }
    })
  });

  const FollowerNode = new GraphQLObjectType({
    name: 'FollowerNode',
    fields: () => ({
      node: Customer
    })
  });

  const Customer = new GraphQLObjectType({
    name: 'Customer',
    description: 'These are the users',
    fields: () => ({
      id: { type: GraphQLInt },
      name: { type: GraphQLString },
      followers: {
        type: FollowerConnection,
        resolve(parent, args, info) {
          return server.models.Follow.find({ where: { followeeId: parent.id }});
        }
      }
    })
  });

  const Query = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      todos: {
        type: new GraphQLList(Todo),
        resolve(rootValue, args, info) {
          return server.models.Todo.all();
        }
      },
      customers: {
        type: new GraphQLList(Customer),
        resolve(rootValue, args, info) {
          return server.models.Customer.all();
        }
      }
    }
  });

  const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      createTodo: {
        type: Todo,
        args: {
          content: {type: new GraphQLNonNull(GraphQLString)},
        },
        resolve(rootValue, args) {
          const newTodo = Object.assign({}, args);
          return server.models.Todo.create(newTodo);
        }
      }
    }
  });

  const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
  });

  return Schema;
};
