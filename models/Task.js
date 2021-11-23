const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    task: String,
    description: String,
    assignee: mongoose.Types.ObjectId,
    priority: String,
    reporter: mongoose.Types.ObjectId,
    parentTask: mongoose.Types.ObjectId
}, {
    timestamps: true
});


exports.TaskSchema = TaskSchema
exports.Task = mongoose.model("Tasks", TaskSchema);
