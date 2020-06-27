const { selectArgsToSql, whereArgsToSql } = require('./utils/sql');

class QueryBuilder {
  constructor() {
    this.state = {
      select: '',
      from: '',
      where: '',
      innerJoin: '',
    };

    this.commands = [];

    this.index = 0;
    this.values = [];
  }

  /* private */
  updateState(args) {
    const { values, index, commands } = args;
    if (index) {
      this.index += index;
    }
    if (values) {
      this.values = this.values.concat(values);
    }
    if (commands) {
      this.commands = this.commands.concat(commands);
    }
  }

  select(args) {
    const commands = 'select';
    const { query, index, values } = selectArgsToSql(args, this.index);

    this.state[commands] = `SELECT ${query}`;
    this.updateState({ index, values, commands });

    return this;
  }

  where(args) {
    const commands = 'where';
    if (!args || Object.keys(args).length === 0) {
      return this;
    }
    const { query, index, values } = whereArgsToSql(args, this.index);

    this.state[commands] = `WHERE ${query}`;
    this.updateState({ index, values, commands });

    return this;
  }

  innerJoin(query) {
    const commands = 'innerJoin';

    if (query) {
      this.state[commands] = query;
      this.updateState({ commands });
    }

    return this;
  }

  from(table) {
    const commands = 'from';
    const index = 1;
    const values = table;

    this.state[commands] = `FROM $${this.index + index}:name`;
    this.updateState({ index, values, commands });

    return this;
  }

  toString() {
    if (this.select) {
      if (!this.from) {
        throw new Error('from argument missing');
      }

      const { values } = this;

      const query = this.commands.map(command => this.state[command]).join(' ');

      console.log({ query, values });

      return { query, values };
    }
    return {};
  }
}

module.exports = QueryBuilder;
