const { body, param } = require('express-validator')
const { isValidObjectId } = require('mongoose')
const { Board } = require('../models/Board')
const { Task } = require('../models/Task')

exports.validateIndexList = [
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
]

exports.validateCreateList = [
	param('boardId')
		.exists()
		.bail()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ _id: value, 'members._id': req.user._id })
			// code yet to be added for permission check
			if (!board) return Promise.reject('board does not exist !')
			req.board = board
		}),
	body('name')
		.exists()
		.bail()
		.isString()
		.isLength({ min: '2', max: '50' })
		.custom(async (value, { req }) => {
			const boardLists = req.board.lists
			if (boardLists.findIndex((l) => l.name === value) >= 0) {
				return Promise.reject('list name already exists for this board !')
			}
		}),
]

exports.validateEditList = [
	param('boardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			// code yet to be added for permission check
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board does not exist !')
			req.board = board
		}),
	param('listId')
		.exists()
		.bail()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom((value, { req }) => {
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) throw new Error('list not found for this board !')
			req.listIndex = listIndex
			return true
		}),
	body('name')
		.exists()
		.isString()
		.isLength({ min: '3', max: '20' })
		.custom((value, { req }) => {
			if (req.board.lists[req.listIndex]['name'] === value) throw new Error('list name already exists for this board !')
			return true
		}),
]

exports.validateDeleteList = [
	param('boardId')
		.exists()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			// code yet to be added for permission check
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board does not exist !')
			req.board = board
		}),
	param('listId')
		.exists()
		.bail()
		.isString()
		.custom((value) => isValidObjectId(value))
		.custom((value, { req }) => {
			const listIndex = req.board.lists.findIndex((l) => l._id == value)
			if (listIndex === -1) throw new Error('list not found for this board !')
			req.listIndex = listIndex
			return true
		}),
]
