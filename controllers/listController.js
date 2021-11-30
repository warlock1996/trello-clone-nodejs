const User = require("../models/User")
const { List } = require("../models/List")
const { Board } = require("../models/Board")
const { Task } = require("../models/Task")


exports.handleGetList = async (req, res) => {
    try {
        const board = req.board
        const lists = board.lists
        return res.json({ error: false, data: lists })
    } catch (error) {
        console.error(error)
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
        console.error(error)
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
        console.error(error)
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
        console.error(error)
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
        console.error(error)
    }
};
