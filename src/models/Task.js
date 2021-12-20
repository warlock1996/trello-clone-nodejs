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

const TaskSchemaWithSubtask = new mongoose.Schema({
    task: String,
    description: String,
    assignee: { type: mongoose.Types.ObjectId, ref: 'User' },
    priority: String,
    reporter: { type: mongoose.Types.ObjectId, ref: 'User' },
    subtasks: [TaskSchema]
}, {
    timestamps: true
})



exports.TaskSchema = TaskSchemaWithSubtask
exports.Task = mongoose.model("Tasks", TaskSchemaWithSubtask);


