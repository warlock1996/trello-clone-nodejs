const mongoose = require("mongoose");
const { ListSchema } = require("./List")
const { PermissionSchema } = require("./Permission")



const MemberSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: String,
	email: String,
	permissions: PermissionSchema
})


const BoardSchema = new mongoose.Schema({
	name: String,
	lists: [ListSchema],
	members: [MemberSchema],
}, {
	timestamps: true
});


exports.BoardSchema = BoardSchema
exports.Board = mongoose.model("Boards", BoardSchema);
