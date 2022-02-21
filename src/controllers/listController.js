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

exports.handleCreateList = async (req, res) => {
	try {
		const board = req.board,
			name = req.body.name
		const list = new List({
			name: name,
		})
		board.lists.push(list)
		await board.save()
		return res.json({
			error: false,
			data: list,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleEditList = async (req, res) => {
	try {
		const board = req.board,
			listIndex = req.listIndex,
			name = req.body.name
		board.lists[listIndex]['name'] = name
		await board.save()
		return res.json({
			error: false,
			data: board.lists[listIndex],
		})
	} catch (error) {
		handleError(error, res)
	}
}

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
