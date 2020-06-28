const { camelToSnakeCase } = require('./utils/sql');

const walkQueryParams = (args, prefix, prefixAlias = {}) =>
  Object.keys(args).reduce((acc, argKey) => {
    if (Object.values(args[argKey]).length > 0) {
      const acc2 = walkQueryParams(args[argKey], prefixAlias[argKey] || argKey);
      Object.assign(acc, acc2);
    } else {
      if (!acc[prefix]) {
        acc[prefix] = {};
      }
      acc[prefix][camelToSnakeCase(argKey)] = `${prefix}.${argKey}`;
    }

    return acc;
  }, {});

const aliasParams = (params, args) => {
  return Object.keys(args).forEach((arg) => {
    const replacement = args[arg];
    const [_, newColumn] = replacement.split('.');
    const [table, column] = arg.split('.');

    if (params[table] && params[table][column]) {
      params[table][newColumn] = params[table][column];
      delete params[table][column];
    }
  });
};

const getSelectParams = ({ table, args: queryArgs, columnAlias, prefixAlias }) => {
  const selectParams = walkQueryParams(queryArgs, table, prefixAlias);

  aliasParams(selectParams, columnAlias);

  return selectParams;
};

module.exports = {
  getSelectParams,
};
