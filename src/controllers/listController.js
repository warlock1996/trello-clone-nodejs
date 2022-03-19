const { List } = require("../models/List")
const { Task } = require("../models/Task")
const { handleError } = require("../utils/error")

exports.handleGetList = async (req, res) => {
	try {
		return res.json({ error: false, data: req.board.lists })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleCreateList = async (req, res) => {
	try {
		const list = new List({
			name: req.body.name,
		})
		board.lists.push(list)
		await req.board.save()
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
		req.board.lists[req.listIndex]['name'] = req.body.name
		await board.save()
		return res.json({
			error: false,
			data: req.board.lists[req.listIndex],
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleDeleteList = async (req, res) => {
	try {
		const list = req.board.lists[req.listIndex]
		req.board.lists = req.board.lists.filter((l) => l._id != list._id)
		await req.board.save()

		const results = await Task.deleteMany({ _id: { $in: list.tasks } })

		return res.json({
			error: false,
			data: list,
			listTasksDetails: results,
		})
	} catch (error) {
		handleError(error, res)
	}
}
