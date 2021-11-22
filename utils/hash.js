const crypto = require("crypto");

exports.getHash = (value) => {
	return crypto.createHash("sha256").update(value).digest("base64");
};
