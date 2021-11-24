const { verify } = require("../utils/jwt");
const User = require("../models/User")

exports.checkAuth = async (req, res, next) => {
	try {
		const bearerToken = req.get("Authorization");
		if (bearerToken) {
			const decoded = await verify(bearerToken);
			const user = await User.findOne({ email: decoded.email })
			if (!user) res.status(401).json({ error: true, message: 'user not found!' })

			req.user = user

			console.log(req.body)
			return next()
		}

		res.status(401).json({
			error: true,
			message: 'Unauthorized!'
		})

            
    } catch (error) {
		console.log(error)
		console.log(error.message)
    }
};
