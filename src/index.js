const QueryBuilderRaw = require('./query-builder');
const { getSelectParams } = require('./select-params');

module.exports = {
  QueryBuilder: () => new QueryBuilderRaw(),
  getSelectParams,
};
