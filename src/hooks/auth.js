const errors = require('feathers-errors');

const boredEmails = [
  'chasen@chasenlehara.com',// Admin
  'broomhf3@gmail.com',
  'Gogreenwzane@gmail.com',
  'jmorga11@gmail.com',
  'santoschris92@gmail.com',
  'transc.ntinental@gmail.com',
  'vic.lbh3@gmail.com'
];

const checkEmails = function(allowedEmails) {
  return function(hook) {
    if (hook.type !== 'before') {
      throw new Error('This hook should only be used as a “before” hook.');
    }

    // If it was an internal call then skip this hook
    if (!hook.params.provider) {
      return hook;
    }

    if (!hook.params.user) {
      throw new errors.NotAuthenticated('You are not authenticated.');
    }

    const error = new errors.Forbidden('You do not have valid permissions to access this.');

    // If allowedEmails is not an array, normalize it
    if (!Array.isArray(allowedEmails)) {
      allowedEmails = [allowedEmails];
    }

    // Iterate through all the user’s emails and check to see
    // if any one of them is in the list of allowed emails.
    const userEmails = hook.params.user.googleProfile && hook.params.user.googleProfile.emails || [];
    const authorized = userEmails.some(email => allowedEmails.indexOf(email.value) !== -1);

    if (!authorized) {
      throw error;
    }
  };
};

module.exports = {
  restrictToAdmin: function() {
    return checkEmails(boredEmails[0]);
  },
  restrictToBored: function() {
    return checkEmails(boredEmails);
  }
};
