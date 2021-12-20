const { body, param, query } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { Board } = require("../models/Board");
const User = require("../models/User")
const { verify } = require("../utils/jwt")

exports.validateCreateBoard = [
	body("name").exists().isString().isLength({ min: "3", max: "20" }).custom(async (value, { req }) => {
		const userBoardIds = req.user.boards
		const boards = await Board.find({ _id: userBoardIds, name: value }).exec()
		if (boards.length) return Promise.reject('board with this name already exists !')
	}),
];

exports.validateEditBoard = [
	param("boardId")
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.notEmpty()
		.bail()
		.isString()
		.custom(async (value, { req }) => {
			const boardIndex = req.user.boards.findIndex(b => b._id == value)
			if (boardIndex === -1) return Promise.reject('board not found !')
			req.boardIndex = boardIndex
		}),
	body("name")
		.exists({ checkNull: true, checkFalsy: true })
		.notEmpty().bail()
		.isString().bail()
		.isLength({ min: "3", max: "20" }).bail()
		.custom(async (value, { req }) => {
			if (req.user.boards[req.boardIndex]['name'] === value) return Promise.reject('board already exists !')
		})
];

exports.validateDeleteBoard = [
	param("boardId")
		.exists().bail()
		.isString().bail()
		.custom((value) => isValidObjectId(value))
		.custom(async (value, { req }) => {
			const boardIndex = req.user.boards.findIndex(b => b._id == value)
			if (boardIndex === -1) return Promise.reject('board not found !')
		}),
]

exports.validateInviteUser = [
	param("boardId")
		.exists().bail()
		.isString().bail()
		.custom(value => isValidObjectId(value)).bail()
		.custom(async (value, { req }) => {
			const boardIndex = req.user.boards.findIndex(b => b._id == value)
			if (boardIndex === -1) return Promise.reject("board not found for this user !")
		}),
	body("emails")
		.exists({ checkNull: true, checkFalsy: true }).withMessage("expected emails property on body").bail()
		.isArray({ min: 1, max: 5 }).withMessage('emails should be an array with atleast one element !').bail()
		.customSanitizer((value, { req }) => {
			return value.filter(email => email !== req.user.email)
		})
]

exports.validateAcceptInvite = [
	param("inviteToken")
		.exists({ checkNull: true, checkFalsy: true }).bail()
		.notEmpty({ checkNull: true, checkFalsy: true }).bail()
		.custom(async (value, { req }) => {
			const decodedInviteToken = await verify(value)
			req.decodedInviteToken = decodedInviteToken
		}).bail()
		.custom(async (value, { req }) => {
			if (req.user.email !== req.decodedInviteToken.email)
				return Promise.reject('you are not authorized to use the invite token !')
		}).bail()
		.custom(async (value, { req }) => {
			const board = await Board.findById(req.decodedInviteToken.boardId)
			if (!board) return Promise.reject('board not found !')
			req.board = board
		})
]