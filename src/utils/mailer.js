const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "84e806eda71196",
		pass: "8e03062ea13cac",
	},
});
const mail = (to, subject, text, html) => {
	return transport.sendMail({
		from: 'warlock1996',
		to,
		subject,
		text,
		html,
	})
}

exports.transport = transport;
exports.mail = mail
