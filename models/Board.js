const mongoose = require("mongoose");

const BoardsSchema = new mongoose.Schema({
	name: String,
	lists: Array,
	members: Array,
});

module.exports = mongoose.model("Boards", BoardsSchema);
