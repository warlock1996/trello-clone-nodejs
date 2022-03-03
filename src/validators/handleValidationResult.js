const { validationResult } = require("express-validator");

const validate = validations => {
	return (async (req, res, next) => {
		for (let validation of validations) {
			const result = await validation.run(req)
			if (result.errors.length) break;
		}
		const errors = validationResult(req)
		if (!errors.isEmpty()) return res.status(422).send(errors.mapped())

		next()

	})
}

module.exports = validate;
