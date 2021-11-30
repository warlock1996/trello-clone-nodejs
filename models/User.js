const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	email_verified_at: { type: Date, default: null },
	token: { type: String, default: null },
	address: String,
	boards: [mongoose.Types.ObjectId]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
