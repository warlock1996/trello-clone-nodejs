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
		// if both boards are same
		if (req.fromBoard._id.toString() === req.toBoard._id.toString()) {
			req.fromBoard.lists[req.fromListIndex]['tasks'] = req.fromBoard.lists[req.fromListIndex]['tasks'].filter(
				(t) => t._id.toString() != req.params.taskId.toString()
			)
			req.fromBoard.lists[req.toListIndex]['tasks'].push(req.params.taskId)

			const isSaved = await req.fromBoard.save()
			if (!isSaved) return Promise.reject('failed to move task !')

			return res.json({ error: false, message: `Task: ${req.params.taskId} moved to List: ${req.params.toListId}` })
		}

		req.fromBoard.lists[req.fromListIndex]['tasks'] = req.fromBoard.lists[req.fromListIndex]['tasks'].filter(
			(t) => t._id.toString() != req.params.taskId.toString()
		)
		req.toBoard.lists[req.toListIndex]['tasks'].push(req.params.taskId)

		const fromBoard = await req.fromBoard.save()
		const toBoard = await req.toBoard.save()
		if (!fromBoard || !toBoard) return res.json({ error: true, message: 'failed to move task !' })

		return res.json({ error: false, message: `Task: ${req.params.taskId} moved to List: ${req.params.toListId}` })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleCopyTask = async (req, res) => {
	const task = await new Task({
		task: req.body.task,
		description: req.task.description,
		date: req.task.date,
		members: req.body.members ? req.task.members : [],
		labels: req.body.labels ? req.task.labels : [],
		reporter: new mongoose.Types.ObjectId(req.user._id),
		comments: req.body.comments ? req.task.comments : [],
		attachments: req.body.attachments ? req.task.attachments : [],
	})

	const isTaskSaved = await task.save()
	if (!isTaskSaved) return Promise.reject('failed to save task !')
	req.toBoard.lists[req.toListIndex].tasks = [...req.toBoard.lists[req.toListIndex].tasks, task._id]
	const isBoardSaved = await req.toBoard.save()
	if (!isBoardSaved) return Promise.reject('failed to save board !')
	return res.json({ error: false, message: 'task copied successfully !' })
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

exports.handleTaskAttachmentUpload = async (req, res) => {
	try {
		req.files.forEach((file) => {
			req.task.attachments.push({
				_id: new mongoose.Types.ObjectId(),
				name: file.filename,
				uploader: req.user._id,
				isCover: false,
			})
		})
		const task = await req.task.save()
		if (!task) return res.json({ error: true, message: 'failed to upload attachment !' })

		return res.json({ error: false, data: task })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleAttachmentMakeCover = async (req, res) => {
	try {
		req.task.attachments = req.task.attachments.map((att) => {
			if (att._id.toString() === req.params.attachmentId) {
				return { _id: att._id, name: att.name, uploader: att.uploader, isCover: req.body.isCover }
			}
			return { _id: att._id, name: att.name, uploader: att.uploader, isCover: false }
		})
		const task = await req.task.save()
		if (!task) return res.json({ error: true, message: 'failed to make attachment cover !' })
		return res.json({ error: false, data: task })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleCreateTaskComment = async (req, res) => {
	req.task.comments.push({
		_id: new mongoose.Types.ObjectId(),
		comment: req.body.comment,
		creator: req.user._id,
	})
	const task = await req.task.save()
	if (!task) return res.json({ error: true, message: 'failed to create comment !' })
	return res.json({
		error: false,
		data: task,
		message: 'comment created succesfully !',
	})
}
