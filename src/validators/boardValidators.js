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
	param("id")
		.exists({ checkNull: true, checkFalsy: true })
		.bail()
		.notEmpty()
		.bail()
		.isString()
		.custom((value, { req }) => {
			const boardIndex = req.user.boards.findIndex(b => b._id == value)
			if (boardIndex === -1) return false

			req.boardIndex = boardIndex
			return true

		}).withMessage("board not found !"),
	body("name").exists({ checkNull: true, checkFalsy: true })
		.notEmpty().bail().isString().isLength({ min: "3", max: "20" }).custom((value, { req }) => {
			if (req.user.boards[req.boardIndex]['name'] === value) return false
			else return true
		}).withMessage("board already exists !"),
];

exports.validateDeleteBoard = [
	param("id")
		.exists()
		.bail()
		.isString()
		.custom((value, { req }) => {
			const boardIndex = req.user.boards.findIndex(b => b._id == value)
			if (boardIndex === -1) return false

			return true
		}).withMessage('board not found !'),
]

exports.validateInviteUser = [
	param("boardId")
		.exists()
		.bail()
		.isString()
		.custom(value => isValidObjectId(value)).bail()
		.custom(async (value, { req }) => {
			const boardIndex = req.user.boards.findIndex(b => b._id == value)
			if (boardIndex === -1) return Promise.reject("board not found for this user !")
		}),
	body("emails").exists({ checkNull: true, checkFalsy: true }).withMessage("expected emails property on body").bail()
		.isArray({ min: 1, max: 5 }).withMessage('emails should be an array with atleast one element !')
		.bail()
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