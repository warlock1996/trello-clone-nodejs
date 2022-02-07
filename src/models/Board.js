const mongoose = require('mongoose')
const { ListSchema } = require('./List')
const { PermissionSchema } = require('./Permission')

const MemberSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: String,
	email: String,
	permissions: PermissionSchema,
})

const LabelsSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	text: String,
	color: String,
})

const BoardSchema = new mongoose.Schema(
	{
		name: String,
		lists: [ListSchema],
		members: [MemberSchema],
		labels: [LabelsSchema],
		userId: { type: mongoose.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
)

exports.BoardSchema = BoardSchema
exports.Board = mongoose.model('Boards', BoardSchema)
