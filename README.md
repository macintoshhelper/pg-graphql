# pg-graphql

Query only the necessary SQL data using your GraphQL query fields, with JOINs support.

## Get Started

```sh
npm i pg-graphql
```

## Usage

```js
const graphqlFields = require('graphql-fields');

const COLUMN_ALIAS = {
  'users.id': 'users.uuid',
};

const PREFIX_ALIAS = {
  owner: 'users',
};

const resolver = {
  Query: {
    user: async (_, { id }, context, info) => {
      const args = graphqlFields(info);

      const params = getSelectParams({
        table: 'users',
        args,
        columnAlias: COLUMN_ALIAS,
        prefixAlias: PREFIX_ALIAS,
      });

      const user = await Users.byId(id, params, {});
    },
  }
};
```
