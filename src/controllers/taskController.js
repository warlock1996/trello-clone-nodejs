const { matchedData } = require('express-validator')
const { Task } = require('../models/Task')
const { handleError } = require('../utils/error')
const mongoose = require('mongoose')

exports.handleIndexTask = async (req, res) => {
	try {
		return res.json({
			error: false,
			data: req.task,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleCreateTask = async (req, res) => {
	try {
		const board = req.board,
			listIndex = req.listIndex,
			parentTask = req.task || null

		const task = new Task({
			task: req.body.task,
			description: '',
			date: {
				dueDate: null,
				startDate: null,
				endDate: null,
			},
			members: [],
			labels: [],
			reporter: new mongoose.Types.ObjectId(req.user._id),
			comments: [],
			attachments: [],
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
}

exports.handleEditTask = async (req, res) => {
	try {
		const validatedData = matchedData(req, { locations: ['body'] })
		const task = await Task.findByIdAndUpdate(req.params.taskId, validatedData, {
			returnDocument: 'after',
		})
		if (!task) return res.json({ error: true, message: 'failed to save' })
		return res.json({ error: false, data: task })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleDeleteTask = async (req, res) => {
	try {
		if (req.subtaskIndex >= 0) {
			req.task.subtasks = req.task.subtasks.filter((st) => st._id != req.params.subtaskId)
			const task = await req.task.save()
			if (!task) return res.json({ error: true, message: 'failed to delete subtask !' })
			return res.json({ error: false, data: task })
		}

		const task = await Task.findByIdAndDelete(req.params.taskId)
		if (!task) return res.json({ error: true, message: 'failed to delete task !' })

		req.board.lists[req.listIndex]['tasks'] = req.board.lists[req.listIndex]['tasks'].filter(
			(listTaskId) => listTaskId != req.params.taskId
		)
		const board = await req.board.save()
		if (!board) return res.json({ error: true, message: 'failed to save board !' })

		return res.json({ error: false, data: task })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleMoveTask = async (req, res) => {
	try {
		req.board.lists[req.fromListIndex]['tasks'] = req.board.lists[req.fromListIndex]['tasks'].filter(
			(t) => t._id.toString() != req.params.taskId.toString()
		)
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
