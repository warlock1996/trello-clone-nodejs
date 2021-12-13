const { body, param } = require("express-validator");
const User = require("../models/User");
const { getHash } = require("../utils/hash");
const { verify } = require("../utils/jwt");


exports.validateSignUp = [
	body("name").exists().isString().isLength({ min: "3", max: "20" }),
	body("email")
		.exists()
		.bail()
		.isEmail()
		.bail()
		.custom(async (value) => {
			const user = await User.findOne({ email: value });
			if (user) return Promise.reject("E-mail already in use !");
		}),
	body("password").exists().isStrongPassword(),
	body("address").exists().isString().isLength({ min: "8", max: "40" })
];

exports.validateLogin = [
	body("password").exists().isString(),
	body("email")
		.exists()
		.isEmail()
		.bail()
		.custom(async (value, { req }) => {
			const hashedPassword = getHash(req.body.password);
			const user = await User.findOne({ email: value });
			if (!user) return Promise.reject("Account not found !");
			if (user.email_verified_at === null) return Promise.reject("Email not verified !")
			if (user.password !== hashedPassword) return Promise.reject("Invalid password");
			req.user = user
		})
];

exports.validateLink = [
	param("hash")
		.exists()
		.bail()
		.custom(async (value, { req }) => {
			const decoded = await verify(value);
			const user = await User.findOne({ email: decoded.email });
			if (!user) return Promise.reject("No Account Found !");
			if (user.email_verified_at)
				return Promise.reject("Email Verified Already !");
			req.user = user;
		})
];
