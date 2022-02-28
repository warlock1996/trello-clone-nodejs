const { body, param, query } = require('express-validator')
const { isValidObjectId } = require('mongoose')
const { Board } = require('../models/Board')
const User = require('../models/User')
const { verify } = require('../utils/jwt')

exports.validateCreateBoard = [
	body('name')
		.exists()
		.isString()
		.isLength({ min: '3', max: '20' })
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ userId: req.user._id, name: value })
			if (board) return Promise.reject('board with this name already exists !')
		}),
]

exports.validateEditBoard = [
	param('boardId')
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.notEmpty()
		.bail()
		.isString()
		.custom(async (value, { req }) => {
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board not found !')
			req.board = board
		}),
	body('name')
		.optional()
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty()
		.bail()
		.isString()
		.bail()
		.isLength({ min: '3', max: '20' })
		.bail()
		.custom(async (value, { req }) => {
			const board = await Board.findOne({ name: value })
			if (board) return Promise.reject('board with this name already exists !')
		}),
	body('starred')
		.optional()
		.isBoolean()
		.bail()
		.custom(async (value, { req }) => {
			if (req.board.starred == value) return Promise.reject('board already starred !')
		}),
]

exports.validateDeleteBoard = [
	param('boardId')
		.exists()
		.bail()
		.isString()
		.bail()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board not found !')
		}),
]

exports.validateInviteUser = [
	param('boardId')
		.exists()
		.bail()
		.isString()
		.bail()
		.custom((value) => isValidObjectId(value))
		.bail()
		.custom(async (value, { req }) => {
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board not found for this user !')
		}),
	body('emails')
		.exists({ checkNull: true, checkFalsy: true })
		.withMessage('expected emails[] on body')
		.bail()
		.isArray({ min: 1, max: 5 })
		.withMessage('emails should be an array with atleast one element !')
		.bail()
		.customSanitizer((value, { req }) => {
			// remove current user from emails
			return value.filter((email) => email !== req.user.email)
		})
		.customSanitizer(async (value, { req }) => {
			const emails = await User.find({ email: { $in: value } }).exec()
			// verify emails from database and keep only matching emails
			return value.filter((email) => emails.find((em) => em.email === email))
		}),
]

exports.validateAcceptInvite = [
	param('inviteToken')
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.notEmpty({ checkNull: true, checkFalsy: true })
		.bail()
		.custom(async (value, { req }) => {
			const decodedInviteToken = await verify(value)
			req.decodedInviteToken = decodedInviteToken
		})
		.bail()
		.custom(async (value, { req }) => {
			if (req.user.email !== req.decodedInviteToken.email)
				return Promise.reject('you are not authorized to use the invite token !')
		})
		.bail()
		.custom(async (value, { req }) => {
			const board = await Board.findById(req.decodedInviteToken.boardId)
			if (!board) return Promise.reject('board not found !')
			req.board = board
		}),
]

exports.validateSearchMembers = [
	param('boardId')
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.notEmpty()
		.bail()
		.isString()
		.custom(async (value, { req }) => {
			const board = await Board.findById(value)
			if (!board) return Promise.reject('board not found !')
			req.board = board
		}),
	query('search')
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.notEmpty({ checkNull: true, checkFalsy: true })
		.bail()
		.isString()
		.bail()
		.trim()
		.unescape(),
]
