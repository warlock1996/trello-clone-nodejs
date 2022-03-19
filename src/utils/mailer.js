const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
	host: 'smtp.mailtrap.io',
	port: 2525,
	auth: {
		user: process.env.EMAILCLIENT_USER,
		pass: process.env.EMAILCLIENT_PASS,
	},
})

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
