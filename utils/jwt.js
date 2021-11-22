const jwt = require("jsonwebtoken");
const util = require("util");

const asyncSign = util.promisify(jwt.sign);
const asyncVerify = util.promisify(jwt.verify);

exports.sign = async (payload, options = {}) => {
	return await asyncSign(payload, process.env.JWT_SECRET, {
		expiresIn: 5000,
		...options,
	});
};

exports.verify = async (payload) => {
	return await asyncVerify(payload, process.env.JWT_SECRET);
};
