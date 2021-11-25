const User = require("../models/User")
const { Task } = require("../models/Task")
const { matchedData } = require("express-validator")


exports.handleGetTask = async (req, res) => {
    try {

    } catch (error) {
        console.error(error)
    }
}

exports.handleCreateTask = async (req, res) => {
    try {
        const user = req.user, boardIndex = req.boardIndex, listIndex = req.listIndex
        const task = new Task({
            task: req.body.task,
            description: req.body.description || '',
            assignee: req.body.assignee,
            priority: req.body.priority || '',
            reporter: req.body.reporter,
            parentTask: req.body.parentTask || null
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
        const validatedData = matchedData(req, { locations: ['body'] })
        const task = await Task.findByIdAndUpdate(req.params.id, validatedData, {
            new: true,
        })
        if (!task) return res.json({ error: true, message: "failed to update !" })

        return res.json({ error: false, data: task })
    } catch (error) {
        console.error(error)
    }
};
exports.handleDeleteTask = async (req, res) => {
    try {
        const user = req.user, boardIndex = req.boardIndex, listIndex = req.listIndex
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task) return res.json({ error: true, message: 'failed to delete task !' })

        console.log(boardIndex, listIndex, task._id)

        user.boards[boardIndex]['lists'][listIndex]['tasks'] = user.boards[boardIndex]['lists'][listIndex]['tasks'].filter(t => t._id != req.params.id)
        console.log(user.boards[boardIndex]['lists'][listIndex]['tasks'])
        const updatedUser = await user.save()
        if (!updatedUser) return res.json({ error: true, message: 'failed to delete task from user !' })

        return res.json({ error: false, data: task })

    } catch (error) {
        console.error(error)
    }
};
