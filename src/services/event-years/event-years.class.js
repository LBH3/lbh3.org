/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find () {
    const eventsService = this.options.app.service('api/events');
    const params = {
      query: {
        $limit: 1,
        $sort: {
          start_datetime: 1
        },
        start_datetime: {
          $lte: new Date()
        }
      }
    };
    return eventsService.find(params).then(function(results) {
      const firstResult = results.data[0];
      params.query.$sort.start_datetime = -1;
      return eventsService.find(params).then(function(results) {
        const lastResult = results.data[0];
        const firstYear = firstResult.start_datetime.getFullYear();
        const lastYear = lastResult.start_datetime.getFullYear();
        const years = [];
        for (var i = firstYear; i <= lastYear; i++) {
          years.push({
            id: i
          });
        }
        return {
          data: years
        };
      });
    });
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
