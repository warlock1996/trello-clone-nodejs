const nodemailer = require('nodemailer')
const { google } = require('googleapis')

const mail = async (to, subject, text, html) => {
	const OAuth2Client = new google.auth.OAuth2(process.env.EMAIL_CLIENT_ID, process.env.EMAIL_CLIENT_SECRET)
	OAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN })
	const accessToken = await OAuth2Client.getAccessToken()
	const transport = nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			type: 'OAuth2',
			user: 'arslanali.921996@gmail.com',
			clientId: process.env.EMAIL_CLIENT_ID,
			clientSecret: process.env.EMAIL_CLIENT_SECRET,
			refreshToken: process.env.EMAIL_REFRESH_TOKEN,
			accessToken: accessToken,
		},
	})
	return transport.sendMail({
		from: 'warlock1996',
		to,
		subject,
		text,
		html,
	})
}

// exports.transport = transport
module.exports = mail
