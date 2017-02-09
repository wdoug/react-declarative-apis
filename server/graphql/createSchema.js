'use strict';
const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
  GraphQLEnumType,
  GraphQLNonNull,
} = require('graphql');

module.exports = function(server) {
  const Todo = new GraphQLObjectType({
    name: 'Todo',
    description: 'Represent the type of an todo of a blog post or a comment',
    fields: () => ({
      id: {type: GraphQLString},
      content: {type: GraphQLString},
    }),
  });

  const Query = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
      todos: {
        type: new GraphQLList(Todo),
        resolve: function(rootValue, args, info) {
          return server.models.Todo.all();
        },
      },
    },
  });

  const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
      createTodo: {
        type: Todo,
        args: {
          content: {type: new GraphQLNonNull(GraphQLString)},
        },
        resolve: function(rootValue, args) {
          const newTodo = Object.assign({}, args);
          return server.models.Todo.create(newTodo);
        },
      },
    },
  });

  const Schema = new GraphQLSchema({
    query: Query,
    mutation: Mutation,
  });

  return Schema;
};
