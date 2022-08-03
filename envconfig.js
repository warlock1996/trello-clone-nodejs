const dotenv = require('dotenv')

module.exports = configureEnv = () => {
	try {
		const result = dotenv.config()
		if (result.error) throw result.error
	} catch (error) {
		console.error(error.message)
	}
}
