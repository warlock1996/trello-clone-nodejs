const mongoose = require('mongoose')

const AttachmentSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	url: String,
})

const CommentSchema = new mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	comment: String,
})

const TaskSchema = new mongoose.Schema(
	{
		task: String,
		description: String,
		date: {
			dueDate: Date,
			startDate: Date,
			endDate: Date,
		},
		members: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
		labels: [{ type: mongoose.Types.ObjectId }],
		reporter: { type: mongoose.Types.ObjectId, ref: 'User' },
		comments: [CommentSchema],
		attachments: [AttachmentSchema],
	},
	{
		timestamps: true,
	}
)

TaskSchema.add({ subtasks: [TaskSchema] })

exports.TaskSchema = TaskSchema
exports.Task = mongoose.model('Task', TaskSchema)
