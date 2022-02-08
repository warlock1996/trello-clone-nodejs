const User = require("../models/User");
const { getHash } = require("../utils/hash");
const { mail } = require("../utils/mailer");
const { log } = require("../utils/logger");
const { sign } = require("../utils/jwt");

exports.handleSignUp = async (req, res) => {
	try {
		const { name, email, password } = req.body
		const hashedPassword = getHash(password)
		const user = new User({ name, email, password: hashedPassword })
		await user.save()
		const encodedEmail = await sign({ email: email })
		await mail(
			email,
			'successfull signup',
			'successfully signed up, please visit link to activate account',
			`<a href=http://localhost:8080/account/activate/${encodedEmail}>
				Click to activate http://localhost:8080/account/activate/${encodedEmail}
			</a>`
		)
		return res.json({
			error: false,
			message: `Please check your email (${email}) inbox for account activation link !`,
		})
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
			{ expiresIn: process.env.JWT_EXPIRY }
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
