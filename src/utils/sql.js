const camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const snakeToCamelCase = str => str.replace(
  /([-_][A-z])/g,
  group => group.toUpperCase()
    .replace('-', '')
    .replace('_', ''),
);

const selectArgsToSql = (args, initialIndex = 0) => {
  let index = initialIndex;
  const query = [];
  const values = [];
  // { plots: { column_name: }}
  Object.keys(args).forEach((table) => {
    const tableArgs = args[table];

    Object.keys(tableArgs).forEach((column) => {
      const resName = tableArgs[column];

      query.push(`$${index + 1}:name.$${index + 2}:name AS $${index + 3}:alias`);
      index += 3;
      values.push(...[table, column, resName]);
    })
  });

  return {
    query: query.join(', '),
    values,
    index,
  };
};

const whereArgsToSql = (args, initialIndex = 0) => {
  const tables = Object.keys(args) || [];
  const filter = [];

  let index = initialIndex;
  const values = [];

  tables.forEach((table) => {
    const tableParams = args[table] || [];

    Object.keys(tableParams).forEach((sqlParam) => {
      const paramValue = String(tableParams[sqlParam]);

      if (!paramValue || paramValue.toLowerCase() === 'null') {
        filter.push(`$${table}:name.$${sqlParam}:name IS NULL`);
        index += 2;
        values.push(...[table, sqlParam]);
      } else {
        // make sure sqlParam is alphanumeric please :)
        filter.push(`$${index + 1}:name.$${index + 2}:name = $${index + 3}`);
        index += 3;
        values.push(...[table, sqlParam, paramValue]);
      }
    });
  });

  return {
    query: filter.join(' AND '),
    values,
    index,
  };
};

module.exports = {
  camelToSnakeCase,
  snakeToCamelCase,
  selectArgsToSql,
  whereArgsToSql,
};
