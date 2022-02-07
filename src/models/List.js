const mongoose = require('mongoose')

const ListSchema = new mongoose.Schema(
	{
		name: String,
		tasks: [{ type: mongoose.Types.ObjectId, ref: 'Task' }],
	},
	{ timestamps: true }
)

exports.ListSchema = ListSchema
exports.List = mongoose.model('List', ListSchema)
