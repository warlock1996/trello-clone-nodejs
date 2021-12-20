const { List } = require("../models/List")
const { Task } = require("../models/Task")
const { handleError } = require("../utils/error")

exports.handleGetList = async (req, res) => {
    try {
        const board = req.board
        const lists = board.lists
        return res.json({ error: false, data: lists })
    } catch (error) {
        handleError(error, res)
    }
}

exports.handleMoveTask = async (req, res) => {
    try {
        req.board.lists[req.fromListIndex]['tasks'] = req.board.lists[req.fromListIndex]['tasks'].filter(t => t._id.toString() != req.params.taskId.toString())
        req.board.lists[req.toListIndex]['tasks'].push(req.params.taskId)
        const board = await req.board.save()
        if (!board) return res.json({ error: true, message: 'failed to move task !' })

        return res.json({ error: false, message: `Task: ${req.params.taskId} moved to List: ${req.params.toListId}` })
    } catch (error) {
        handleError(error, res)
    }
}

exports.handleGetTasksByList = async (req, res) => {
    try {
        const list = req.list
        const taskIds = list.tasks
        if (taskIds.length === 0) return res.json({ error: false, data: [], message: 'list is empty' })
        const tasks = await Task.find({ _id: { $in: taskIds } })
        return res.json({ error: false, data: tasks })
    } catch (error) {
        handleError(error, res)
    }
}

exports.handleCreateList = async (req, res) => {
    try {
        const board = req.board, name = req.body.name
        const list = new List({
            name: name
        })
        board.lists.push(list)
        await board.save();
        return res.json({
            error: false,
            data: list
        })
    } catch (error) {
        handleError(error, res)
    }
};

exports.handleEditList = async (req, res) => {
    try {
        const board = req.board, listIndex = req.listIndex, name = req.body.name
        board.lists[listIndex]['name'] = name
        await board.save()
        return res.json({
            error: false,
            data: board.lists[listIndex]
        })
    } catch (error) {
        handleError(error, res)
    }
};
exports.handleDeleteList = async (req, res) => {
    try {
        const board = req.board, listIndex = req.listIndex
        const list = board.lists[listIndex]
        board.lists = board.lists.filter(l => l._id != list._id)
        await board.save();

        const results = await Task.deleteMany({ _id: { $in: list.tasks } })

        return res.json({
            error: false,
            data: list,
            listTasksDetails: results
        })

    } catch (error) {
        handleError(error, res)
    }
};
