const authService = require('./controller');

const splitter = async (action, payload) => {
  switch (action) {
    case 'signup':
      return await authService.signup(payload);

    case 'login':
      return await authService.login(payload.email, payload.password);

    case 'logout':
      return authService.logout(); // sync function

    default:
      throw new Error(`Unknown action: ${action}`);
  }
};

module.exports = splitter;
