exports.sendResponse = (response, status, data) => {
	response.status(status).json(data);
};

exports.handleError = (error, res) => {
	console.error(error.message)
	return res.status(500).json({
		error: true,
		message: 'SERVER ERROR'
	})
}
