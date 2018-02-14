module.exports = (app, user) => {
  return new Promise(function(resolve, reject) {
    const now = new Date();
    const oneMonthAgo = new Date((new Date()).setMonth((new Date()).getMonth() - 1));
    const boredHashersQuery = {
      query: {
        endDate: {
          $gte: oneMonthAgo
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
