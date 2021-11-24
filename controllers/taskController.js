const User = require("../models/User")
const { Task } = require("../models/Task")


exports.handleGetTask = async (req, res) => {
    try {

    } catch (error) {
        console.error(error)
    }
}

exports.handleCreateTask = async (req, res) => {
    try {
        console.log('in create task')
        const user = req.user, boardIndex = req.boardIndex, listIndex = req.listIndex
        const task = new Task({
            task: req.body.task,
            assignee: req.body.assignee,
            reporter: req.body.reporter,
            parentTask: req.body.parentTask
        })
        await task.save()
        user.boards[boardIndex]['lists'][listIndex]['tasks'].push(task._id)
        await user.save()

        return res.json({ error: true, message: "task created !" })

    } catch (error) {
        console.error(error)
    }
};

exports.handleEditTask = async (req, res) => {
    try {

    } catch (error) {
        console.error(error)
    }
};
exports.handleDeleteTask = async (req, res) => {
    try {


    } catch (error) {
        console.error(error)
    }
};
