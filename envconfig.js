const dotenv = require("dotenv");

module.exports = configureEnv = () => {
	try {
		const result = dotenv.config();
		if (result.error) throw result.error;
	} catch (err) {
		console.error(err.message);
	}
};
