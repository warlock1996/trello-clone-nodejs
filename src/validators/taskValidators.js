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
	body('task').exists({ checkNull: true, checkFalsy: true }).bail().notEmpty().bail().isLength({ min: 1, max: 500 }),
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
	param('boardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			// code yet to be added for permission check
			if (!board) return Promise.reject('board does not exist for this user !')
			req.board = board
		}),
	param('fromListId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const fromListIndex = req.board.lists.findIndex((l) => l._id == value)
			if (fromListIndex === -1) return Promise.reject('source list does not exist for this board !')
			req.fromListIndex = fromListIndex
		}),
	param('toListId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const toListIndex = req.board.lists.findIndex((l) => l._id == value)
			if (toListIndex === -1) return Promise.reject('target list does not exist for this board !')
			req.toListIndex = toListIndex
		}),
	param('taskId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const taskIndex = req.board.lists[req.fromListIndex]['tasks'].findIndex((t) => t._id.toString() == value)
			if (taskIndex === -1) return Promise.reject('task does not belong to source list !')
			const task = await Task.findById(value)
			if (!task) return Promise.reject('task does not exist !')
			req.task = task
		}),
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
