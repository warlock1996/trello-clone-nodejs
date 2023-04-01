const User = require('../models/User')
const { getHash } = require('../utils/hash')
const mail = require('../utils/mailer')
const { sign } = require('../utils/jwt')
const { handleError } = require('../utils/error')

exports.handleSignUp = async (req, res) => {
	try {
		const { name, email, password } = req.body
		const hashedPassword = getHash(password)
		const user = new User({ name, email, password: hashedPassword })
		await user.save()
		// const encodedEmail = await sign({ email: email })
		// const status = await mail(
		// 	email,
		// 	'successfull signup',
		// 	'successfully signed up, please visit link to activate account',
		// 	`<a href=${process.env.FRONTEND_SERVER_ADDR}/account/activate/${encodedEmail}>
		// 		Click to activate ${process.env.FRONTEND_SERVER_ADDR}/account/activate/${encodedEmail}
		// 	</a>`
		// )
		// if (!status.accepted.includes(email))
		// 	return res.json({ error: false, message: 'user registered, failed to send email activation link' })

		// return res.json({
		// 	error: false,
		// 	message: `Please check your email (${email}) inbox for account activation link !`,
		// })
		return res.json({
			error: false,
			message: `Success !`,
		})
	} catch (error) {
		console.log(error)
		// handleError(error, res)
	}
}

exports.handleLogin = async (req, res) => {
	try {
		const user = req.user
		const encodedToken = await sign(
			{ email: user.email, name: user.name, subject: 'ACCESSTOKEN' },
			{ expiresIn: process.env.JWT_EXPIRY }
		)
		user.token = encodedToken
		await user.save()
		res.json({
			error: false,
			message: 'successfull authentication',
			token: encodedToken,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleActivation = async (req, res) => {
	try {
		const user = req.user
		user.email_verified_at = new Date().toUTCString()
		await user.save()
		res.json({
			error: false,
			message: `Email verified ${req.user.email}, Account activated !`,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleLogOut = async (req, res) => {
	try {
		req.user.token = null
		const isSaved = await req.user.save()
		if (!isSaved) return res.json({ error: true, message: 'failed to save user !' })
		return res.json({ error: false, message: 'logged out !' })
	} catch (error) {
		handleError(error, res)
	}
}
