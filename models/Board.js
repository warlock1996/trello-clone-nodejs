const mongoose = require("mongoose");
const { ListSchema } = require("./List")

const BoardsSchema = new mongoose.Schema({
	name: String,
	lists: [ListSchema],
	members: [mongoose.Types.ObjectId],
}, {
	timestamps: true
});


exports.BoardsSchema = BoardsSchema
exports.Board = mongoose.model("Boards", BoardsSchema);
