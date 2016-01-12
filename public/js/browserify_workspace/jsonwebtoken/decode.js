var JWT = require('jsonwebtoken');

var decode = function(token) {
	JWT.decode(token);
}

module.exports = decode;
