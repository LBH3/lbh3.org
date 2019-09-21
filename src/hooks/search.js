// A hook that makes a fuzzy text search from a search parameter in the query
const Utils = require('sequelize/lib/utils');

const oldSearchHook = function (options) {
  return function (hook) {
    const query = hook.params.query || {};
    const searchString = query.search;
    if (searchString) {
      const searchTerms = searchString.split(' ').map(term => {
        const trimmedTerm = term.trim();
        return [
          `%${trimmedTerm}%`
        ];
      }).reduce((queries, query) => {
        return [...queries, query];
      }, []);
      query.$or = (options.fields) ? options.fields.map(field => {
        return {
          [field]: {
            $iLike: {
              $any: searchTerms
            }
          }
        };
      }) : [];
      delete query.search;
    }
  };
};

module.exports = function (options) {
  return function (hook) {
    const query = hook.params.query || {};

    if (query.search) {
      const model = hook.app.service('api/hashers').Model;
      const sequelizeClient = hook.app.get('sequelizeClient');

      // Build the SELECT clause
      const queryOptions = {
        attributes: Object.keys(model.tableAttributes),
        model,
        type: sequelizeClient.QueryTypes.SELECT
      };
      Utils.mapFinderOptions(queryOptions, model);
      let countQuery = 'SELECT COUNT(DISTINCT id) FROM hashers';
      let selectQuery = model.QueryInterface.QueryGenerator.selectQuery('hashers', queryOptions, model).slice(0, -1);// Slice to remove ‘;’

      // Build the WHERE clause
      const searchTerms = query.search.replace(/'/gi, '').replace(/-/gi, ' ').trim().split(' ').map(term => {
        return `${term.trim()}:*`;
      }).filter(term => {
        return term.length > 0;
      });
      const fields = options.fields;
      if (options.contains) {
        options.contains.forEach(field => {
          if (field === 'emails') {
            countQuery = `${countQuery}, json_array_elements(hashers.emails) email`;
            selectQuery = `${selectQuery}, json_array_elements(hashers.emails) email`;
            fields.push('email ->> \'value\'');
          } else {
            fields.push(`array_to_string(${field}, ' ')`);
          }
        });
      }
      const tsvector = fields.map(field => {
        if (field === 'hash_name') {
          return `to_tsvector('english', replace(replace(coalesce(${field}, ''), '''', ''), '-', ' '))`;
        } else {
          return `to_tsvector('english', coalesce(${field}, ''))`;
        }
      });
      const whereQuery = `WHERE ${tsvector.join(' || ')} @@ to_tsquery('english', '${searchTerms.join(' & ')}')`;

      // Build the GROUP BY
      let groupByQuery = 'GROUP BY id';

      // Build the ORDER BY
      let orderByQuery = '';
      if (query.$sort) {
        if (query.$sort.lastTrailDate) {
          if (Number(query.$sort.lastTrailDate) === -1) {
            orderByQuery = 'ORDER BY last_trail_date DESC';
          } else {
            orderByQuery = 'ORDER BY last_trail_date ASC';
          }
        }
      }

      // Build the LIMIT and OFFSET
      const limit = query.$limit || hook.app.get('paginate').default;
      const skip = query.$skip ? (parseInt(query.$skip, 10) || 0) : 0;
      const limitAndOffsetQuery = `LIMIT ${limit} OFFSET ${skip};`;

      // Concatenate the entire query
      const sequelizeSelectQuery = `${selectQuery} ${whereQuery} ${groupByQuery} ${orderByQuery} ${limitAndOffsetQuery}`;

      return sequelizeClient.query(sequelizeSelectQuery, queryOptions).then(data => {
        if (data.length === 0 && skip === 0) {
          return oldSearchHook(options.oldOptions)(hook);
        }

        hook.result = {
          data,
          limit,
          skip
        };

        if (skip === 0 && data.length < limit) {
          // Return early because all results have been fetched
          hook.result.total = data.length;
          return hook;
        }

        const sequelizeCountQuery = `${countQuery} ${whereQuery}`;
        return sequelizeClient.query(sequelizeCountQuery).then(result => {
          hook.result.total = parseInt(result[0][0].count, 10);
          return hook;
        });
      });
    }
  };
};
