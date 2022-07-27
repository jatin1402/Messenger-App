const jsonToken = require('jsonwebtoken');

const generateWebToken = (id) => {
  return jsonToken.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateWebToken;
