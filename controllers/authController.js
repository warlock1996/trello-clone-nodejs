const User = require("../models/User");
const { getHash } = require("../utils/hash");
const { mail } = require("../utils/mailer");
const { log } = require("../utils/logger");
const { sign } = require("../utils/jwt");

exports.handleSignUp = async (req, res) => {
	try {
		const { name, email, password, address } = req.body;
		const hashedPassword = getHash(password);
		const user = new User({ name, email, password: hashedPassword, address });
		await user.save();
		const encodedEmail = await sign({ email: email });
		await mail(
			email,
			"successfull signup",
			"successfully signed up, please visit link to activate account",
			`<a href=${req.protocol}://${req.hostname}:5000/account/activate/${encodedEmail}>
				Click to activate ${req.protocol}://${req.hostname}:5000/account/activate/${encodedEmail}
			</a>`
		);
		res.json({
			message: "success",
		});
	} catch (err) {
		console.error(err.message);
		log(err, req);
		res.status(500).json({
			error: "server error",
		});
	}
};

exports.handleLogin = async (req, res) => {
	try {
		const user = req.user;
		const encodedToken = await sign(
			{ email: user.email, subject: "ACCESSTOKEN" },
			{ expiresIn: 500 }
		);
		user.token = encodedToken;
		await user.save();
		res.json({
			error: false,
			message: "successfull authentication",
			token: encodedToken,
		});
	} catch (error) {
		console.error(err.message);
		log(err, req);
		res.status(500).json({
			error: "server error",
		});
	}
};

exports.handleActivation = async (req, res) => {
	try {
		const user = req.user;
		user.email_verified_at = new Date().toUTCString();
		await user.save();
		res.json({
			error: false,
			message: "Email verified, Account activated !",
		});
	} catch (err) {
		console.error(err);
		log(err);
		res.status(500).json({
			error: "server error",
		});
	}
};
