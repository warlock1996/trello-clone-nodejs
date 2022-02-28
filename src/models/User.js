const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		email_verified_at: { type: Date, default: null },
		token: { type: String, default: null },
	},
	{ timestamps: true }
)

UserSchema.index({ email: 'text' })

module.exports = mongoose.model('User', UserSchema)
