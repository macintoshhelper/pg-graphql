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
        filter.push(`${table}.${sqlParam} IS NULL`);
      } else {
        // make sure sqlParam is alphanumeric please :)
        filter.push(`${table}.${sqlParam} = $${index + 1}`);
        index += 1;
        values.push(paramValue);
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
