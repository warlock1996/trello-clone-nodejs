const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	email_verified_at: { type: Date, default: null },
	token: { type: String, default: null},
	address: String,
});

module.exports = mongoose.model("User", UserSchema);
