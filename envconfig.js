const dotenv = require("dotenv");

module.exports = configureEnv = () => {
	try {
		if (process.env.NODE_ENV === 'development') {
			const result = dotenv.config();
			if (result.error) throw result.error;
		}
	} catch (err) {
		console.error(err.message);
	}
};
