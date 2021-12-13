exports.sendResponse = (response, status, data) => {
	response.status(status).json(data);
};
