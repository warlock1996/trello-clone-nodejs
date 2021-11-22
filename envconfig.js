const dotenv = require("dotenv");

exports.configureEnv = () => {
	try {
		const result = dotenv.config();
		if (result.error) throw result.error;
	} catch (err) {
		console.error(err.message);
	}
};
