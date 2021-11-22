const { validationResult } = require("express-validator");

const handleValidationResult = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.json(errors.array());
	} else {
        next()
    }
};

module.exports = handleValidationResult;
