const fs = require("fs/promises");
const path = require("path");

exports.log = async (err, request) => {
	try {
		const newLog = JSON.stringify({
			error: err.message,
			request: request.body
		})
		const logFilePath = path.join("./logs", `${new Date().getUTCDate()}.json`);
		await fs.appendFile(logFilePath, newLog);
	} catch (error) {
		console.error(error.message);
	}
};
