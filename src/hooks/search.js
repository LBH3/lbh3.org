// A hook that makes a fuzzy text search from a $search parameter in the query
module.exports = function (options) {
  return function (hook) {
    const query = hook.params.query || {};
    if (query.$search) {
      const searchTerms = [query.$search].map(term => {
        const trimmedTerm = term.trim();
        return [
          `%${trimmedTerm}%`
        ];
      }).reduce((queries, query) => {
        return [...queries, query];
      }, []);
      const containsQueries = (options.contains) ? options.contains.map(field => {
        return {
          [field]: {
            $contains: [
              query.$search
            ]
          }
        };
      }) : [];
      const iLikeQueries = (options.fields) ? options.fields.map(field => {
        return {
          [field]: {
            $iLike: {
              $any: searchTerms
            }
          }
        };
      }) : [];
      query.$or = [
        ...containsQueries,
        ...iLikeQueries
      ];
      delete query.$search;
    }
  };
};
