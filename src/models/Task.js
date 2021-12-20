const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    task: String,
    description: String,
    assignee: { type: mongoose.Types.ObjectId, ref: 'User' },
    priority: String,
    reporter: { type: mongoose.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

TaskSchema.add({ subtasks: [TaskSchema] })


exports.TaskSchema = TaskSchema
exports.Task = mongoose.model("Tasks", TaskSchema);


