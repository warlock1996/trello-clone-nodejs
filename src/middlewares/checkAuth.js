const { verify } = require('../utils/jwt')
const User = require('../models/User')


const checkAuth = async (req, res, next) => {
	try {
		const bearerToken = req.get('Authorization').split(' ')[1]
		if (bearerToken) {
			const decoded = await verify(bearerToken)
			const user = await User.findOne({
				email: decoded.email,
				token: bearerToken,
			})
			if (!user) return res.status(401).json({ error: true, message: 'user not found!' })

			req.user = user

			console.log('[current user]', req.user.email)
			return next()
		}

		res.status(401).json({
			error: true,
			message: 'Unauthorized!',
		})
	} catch (error) {
		res.status(500).json({
			error: true,
			message: error.message,
		})
	}
}

module.exports = checkAuth
