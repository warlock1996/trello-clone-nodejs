exports.sendResponse = (response, status, data) => {
	response.status(status).json(data);
};

exports.handleError = (error, res) => {
	return res.status(500).json({
		error: true,
		message: 'SERVER ERROR'
	})
}
