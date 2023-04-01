const { body, param } = require('express-validator')
const User = require('../models/User')
const { getHash } = require('../utils/hash')
const { verify } = require('../utils/jwt')

exports.validateSignUp = [
	body('name').exists().isString().isLength({ min: '2', max: '20' }),
	body('email')
		.exists()
		.bail()
		.isEmail()
		.bail()
		.custom(async (value) => {
			const user = await User.findOne({ email: value })
			if (user) return Promise.reject('E-mail already in use !')
		}),
	body('password').exists().isStrongPassword().withMessage('please create a strong password !'),
	body('confirmPassword')
		.exists()
		.custom(async (value, { req }) => {
			if (value !== req.body.password) return Promise.reject('passwords do not match !')
		}),
]

exports.validateLogin = [
	body('email')
		.exists()
		.isEmail()
		.custom(async (value, { req }) => {
			const user = await User.findOne({ email: value })
			if (!user) return Promise.reject('Account not found !')
			// if (user.email_verified_at === null) return Promise.reject('Email not verified !')
			req.user = user
		}),
	body('password')
		.exists()
		.isString()
		.custom(async (value, { req }) => {
			const hashedPassword = getHash(value)
			if (req.user.password !== hashedPassword) return Promise.reject('Invalid password')
		}),
]

exports.validateLink = [
	param('hash')
		.exists()
		.bail()
		.custom(async (value, { req }) => {
			const decoded = await verify(value)
			const user = await User.findOne({ email: decoded.email })
			if (!user) return Promise.reject('No Account Found !')
			if (user.email_verified_at) return Promise.reject('Email Verified Already !')
			req.user = user
		}),
]
