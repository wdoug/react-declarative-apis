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

const Author = new GraphQLObjectType({
  name: 'Author',
  description: 'Represent the type of an author of a blog post or a comment',
  fields: () => ({
    _id: {type: GraphQLString},
    name: {type: GraphQLString},
    twitterHandle: {type: GraphQLString},
  }),
});

const Query = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    authors: {
      type: new GraphQLList(Author),
      resolve: function(rootValue, args, info) {
        return [
          {_id: 1, name: 'Bob', twitterHandle: '@bob'},
        ];
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createAuthor: {
      type: Author,
      args: {
        _id: {type: new GraphQLNonNull(GraphQLString)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        twitterHandle: {type: GraphQLString},
      },
      resolve: function(rootValue, args) {
        const author = Object.assign({}, args);
        throw new Error('not implemented');
      },
    },
  },
});

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

module.exports = Schema;
