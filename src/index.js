const QueryBuilderRaw = require('./query-builder');

module.exports = {
  QueryBuilder: () => new QueryBuilderRaw(),
};
