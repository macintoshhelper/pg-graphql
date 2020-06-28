const QueryBuilderRaw = require('./query-builder');
const { getSelectParams } = require('./select-params');
const {
  camelToSnakeCase,
  snakeToCamelCase,
  selectArgsToSql,
  whereArgsToSql,
} = require('./utils/sql');

module.exports = {
  QueryBuilder: () => new QueryBuilderRaw(),
  camelToSnakeCase,
  snakeToCamelCase,
  selectArgsToSql,
  whereArgsToSql,
  getSelectParams,
};
