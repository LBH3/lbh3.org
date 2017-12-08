module.exports = (app, user) => {
  return new Promise(function(resolve, reject) {
    const now = new Date();
    const boredHashersQuery = {
      query: {
        endDate: {
          $gte: now
        },
        hasherId: user.hasherId,
        startDate: {
          $lte: now
        }
      }
    };
    app.service('api/bored-hashers').find(boredHashersQuery).then(resolve, reject);
  });
};
