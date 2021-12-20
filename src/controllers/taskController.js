const { matchedData } = require("express-validator")
const User = require("../models/User")
const { Task } = require("../models/Task")
const { handleError } = require("../utils/error")



exports.handleIndexTask = async (req, res) => {
    try {
        return res.json({
            error: false,
            data: req.task
        })
    } catch (error) {
        handleError(error, res)
    }
}

exports.handleCreateTask = async (req, res) => {
    try {
        const board = req.board, listIndex = req.listIndex, parentTask = req.task || null

        const task = new Task({
            task: req.body.task,
            description: req.body.description || '',
            assignee: req.body.assignee,
            priority: req.body.priority || '',
            reporter: req.body.reporter
        })
        if (parentTask) {
            parentTask.subtasks.push(task)
            await parentTask.save()
            return res.json({ error: false, data: parentTask })
        }

        await task.save()
        board.lists[listIndex]['tasks'].push(task._id)
        await board.save()
        return res.json({ error: false, data: task })

    } catch (error) {
        handleError(error, res)
    }
};

exports.handleEditTask = async (req, res) => {
    try {
        const validatedData = matchedData(req, { locations: ['body'] })
        if (req.subtaskIndex >= 0) {
            req.task.subtasks[req.subtaskIndex] = { ...req.task.subtasks[req.subtaskIndex], ...validatedData }
            const task = await req.task.save()
            if (!task) return res.json({ error: true, message: 'failed to update subtask !' })
            return res.json({ error: false, data: task })
        }
        const task = await Task.findByIdAndUpdate(req.params.taskId, validatedData, {
            returnDocument: 'after'
        })
        if (!task) return res.json({ error: true, message: "failed to save" })
        return res.json({ error: false, data: task })
    } catch (error) {
        handleError(error, res)
    }
};
exports.handleDeleteTask = async (req, res) => {
    try {
        if (req.subtaskIndex >= 0) {
            req.task.subtasks = req.task.subtasks.filter(st => st._id != req.params.subtaskId)
            const task = await req.task.save()
            if (!task) return res.json({ error: true, message: 'failed to delete subtask !' })
            return res.json({ error: false, data: task })
        }

        const task = await Task.findByIdAndDelete(req.params.taskId)
        if (!task) return res.json({ error: true, message: 'failed to delete task !' })

        req.board.lists[req.listIndex]['tasks'] = req.board.lists[req.listIndex]['tasks'].filter(listTaskId => listTaskId != req.params.taskId)
        const board = await req.board.save()
        if (!board) return res.json({ error: true, message: 'failed to save board !' })

        return res.json({ error: false, data: task })

    } catch (error) {
        handleError(error, res)
    }
};
