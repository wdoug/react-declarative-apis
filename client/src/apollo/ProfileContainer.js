import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { compose } from 'redux';
import Profile from '../presentational/Profile';

const transformDataShapeToPropsShape = ({ data: { loading, customer }, errors }) => {
  return {
    customer: {
      pending: loading,
      rejected: errors && errors.length > 0,
      value: customer && {
        ...customer,
        followers: customer.followers.edges.map(({ node }) => node)
      }
    }
  };
};
const transformMutationToPropsShape = ({ mutate, ownProps }) => {
  return {
    ...ownProps,
    followClicked: mutate
  };
};

const getCustomer = gql`
  query getCustomers($userId: Int!) {
    customer: getCustomer(id: $userId) {
      id
      name
      followers {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

const followUser = gql`
  mutation followUser($userId: Int!, $signedInId: Int!) {
    follow(id: $userId, signedInId: $signedInId) {
      id
      name
      followers {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`;

export default compose(
  graphql(getCustomer, {
    options: ({ id }) => ({ variables: { userId: id } }),
    props: transformDataShapeToPropsShape
  }),
  graphql(followUser, {
    options: ({ id }) => ({ variables: { userId: id, signedInId: 1 } }),
    props: transformMutationToPropsShape
  })
)(Profile);
