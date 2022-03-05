const { body, param } = require('express-validator')
const { isValidObjectId } = require('mongoose')
const User = require('../models/User')
const { Task } = require('../models/Task')
const { Board } = require('../models/Board')

exports.validateIndexTask = [
	param('boardId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board does not exist !')
			req.board = board
		}),
	param('listId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
			req.listIndex = listIndex
		}),
	param('taskId')
		.optional()
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
]

exports.validateCreateTask = [
	param('boardId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board does not exist !')
			req.board = board
		}),
	param('listId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
			req.listIndex = listIndex
		}),
	param('taskId')
		.optional()
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
	body('task')
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.isString()
		.bail()
		.withMessage('task name must be string !')
		.notEmpty()
		.bail()
		.withMessage('task name must not be empty !')
		.trim()
		.isLength({ min: 1, max: 100 }),
]

exports.validateEditTask = [
	param('boardId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board does not exist !')
			req.board = board
		}),
	param('listId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
		}),
	param('taskId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
	body().notEmpty().bail().withMessage('empty body !'),
	body('task')
		.optional()
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.notEmpty()
		.bail()
		.isLength({ min: 1, max: 500 }),
	body('description')
		.optional()
		.exists({ checkNull: false, checkFalsy: false })
		.isString()
		.isLength({ min: 0, max: 10000 }),
	body('members')
		.optional()
		.exists()
		.bail()
		.isArray()
		.bail()
		.custom(async (value, { req }) => {
			value.forEach((v) => {
				if (!isValidObjectId(v)) return Promise.reject('invalid object id in array')
				if (!req.board.members.find((bm) => bm._id.toString() == v))
					return Promise.reject('member does not exist in this board !')
			})
		}),
	body('labels')
		.optional()
		.exists()
		.bail()
		.isArray()
		.bail()
		.custom(async (value, { req }) => {
			value.forEach(async (v) => {
				if (!req.board.labels.find((label) => label._id.toString() == v))
					return Promise.reject('label does not exist in this board !')
			})
		}),
	body('date').optional().isObject().bail(),
	body('date.dueDate').optional().toDate().bail(),
	body('date.startDate')
		.optional()
		.toDate()
		.custom(async (value, { req }) => {
			if (value.getTime() > req.body.date.dueDate)
				return Promise.reject('dueDate should be greater or equal to startDate')
		}),
]

exports.validateDeleteTask = [
	param('boardId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board does not exist !')
			req.board = board
		}),
	param('listId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
			req.listIndex = listIndex
		}),
	param('taskId')
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.custom(async (value, { req }) => {
			if (!isValidObjectId(value)) return Promise.reject('invalid object id')
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
]

exports.validateMoveTask = [
	param('fromBoardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			// code yet to be added for permission check
			if (!board) return Promise.reject('board does not exist for this user !')
			req.fromBoard = board
		}),
	param('toBoardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			// code yet to be added for permission check
			if (!board) return Promise.reject('board does not exist for this user !')
			req.toBoard = board
		}),
	param('fromListId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const fromListIndex = req.fromBoard.lists.findIndex((l) => l._id == value)
			if (fromListIndex === -1) return Promise.reject('source list does not exist for this board !')
			req.fromListIndex = fromListIndex
		}),
	param('toListId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const toListIndex = req.toBoard.lists.findIndex((l) => l._id == value)
			if (toListIndex === -1) return Promise.reject('target list does not exist for this board !')
			req.toListIndex = toListIndex
		}),
	param('taskId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const taskIndex = req.fromBoard.lists[req.fromListIndex]['tasks'].findIndex((t) => t._id.toString() == value)
			if (taskIndex === -1) return Promise.reject('task does not belong to source list !')
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
]

exports.validateCopyTask = [
	param('fromBoardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			// code yet to be added for permission check
			if (!board) return Promise.reject('board does not exist for this user !')
			req.fromBoard = board
		}),
	param('toBoardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			// code yet to be added for permission check
			if (!board) return Promise.reject('board does not exist for this user !')
			req.toBoard = board
		}),
	param('fromListId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const fromListIndex = req.fromBoard.lists.findIndex((l) => l._id == value)
			if (fromListIndex === -1) return Promise.reject('source list does not exist for this board !')
			req.fromListIndex = fromListIndex
		}),
	param('toListId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const toListIndex = req.toBoard.lists.findIndex((l) => l._id == value)
			if (toListIndex === -1) return Promise.reject('target list does not exist for this board !')
			req.toListIndex = toListIndex
		}),
	param('fromTaskId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const taskIndex = req.toBoard.lists[req.fromListIndex]['tasks'].findIndex((t) => t._id.toString() == value)
			if (taskIndex === -1) return Promise.reject('task does not belong to source list !')
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
	body('task').exists().isString().isLength({ min: 1 }).trim(),
	body('attachments').optional().isBoolean(),
	body('comments').optional().isBoolean(),
	body('members').optional().isBoolean(),
	body('labels').optional().isBoolean(),
]

exports.validateGetTasksByList = [
	param('boardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			if (!board) return Promise.reject('board does not exist for this user !')
			req.board = board
		}),
	param('listId')
		.exists()
		.bail()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
			req.list = req.board.lists[listIndex]
		}),
]

exports.validateTaskAttachmentUpload = [
	param('boardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			if (!board) return Promise.reject('board does not exist for this user !')
			req.board = board
		}),
	param('listId')
		.exists()
		.bail()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
			req.list = req.board.lists[listIndex]
		}),
	param('taskId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			if (!req.files) return Promise.reject('file does not exist on req object !')
			req.task = task
		}),
]

exports.validateCreateTaskComment = [
	param('boardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			if (!board) return Promise.reject('board does not exist for this user !')
			req.board = board
		}),
	param('listId')
		.exists()
		.bail()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
			req.list = req.board.lists[listIndex]
		}),
	param('taskId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
	body('comment').exists().isString().trim(),
]

exports.validateMakeCover = [
	param('boardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			if (!board) return Promise.reject('board does not exist for this user !')
			req.board = board
		}),
	param('listId')
		.exists()
		.bail()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) return Promise.reject('list does not exist for this board !')
			req.list = req.board.lists[listIndex]
		}),
	param('taskId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			if (!req.list.tasks.find((listTask) => listTask._id.toString() === value))
				return Promise.reject('task does not exist on this list !')
			const task = await Task.findById(value)
			console.log(task)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
	param('attachmentId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const attachmentIndex = req.task.attachments.findIndex((att) => att._id.toString() == value)
			if (attachmentIndex === -1) return Promise.reject('attachment does not exist !')
		}),
	body('isCover').exists({ checkNull: true, checkFalsy: false }).isBoolean(),
]
