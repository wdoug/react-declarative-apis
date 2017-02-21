import { schema } from 'normalizr';

const customer = new schema.Entity('customers');
const customerWithFollowers = new schema.Entity('customers', {
  followers: [ customer ]
});

const schemas = {
  customers: customerWithFollowers
};

export default schemas;
