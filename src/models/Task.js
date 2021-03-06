const mongoose = require('mongoose')

const AttachmentSchema = new mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,
		name: String,
		uploader: mongoose.Types.ObjectId,
		isCover: Boolean,
	},
	{
		timestamps: true,
	}
)

const CommentSchema = new mongoose.Schema(
	{
		_id: mongoose.Types.ObjectId,
		comment: String,
		creator: mongoose.Types.ObjectId,
	},
	{
		timestamps: true,
	}
)

const TaskSchema = new mongoose.Schema(
	{
		task: String,
		description: String,
		date: {
			startDate: Date,
			dueDate: Date,
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
