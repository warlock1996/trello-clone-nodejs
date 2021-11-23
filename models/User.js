const mongoose = require("mongoose");
const { BoardsSchema } = require("./Board")

const UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String,
	email_verified_at: { type: Date, default: null },
	token: { type: String, default: null },
	address: String,
	boards: [BoardsSchema]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
