const { body, param } = require("express-validator");
const { Board } = require("../models/Board");
const handleValidationResult = require("./handleValidationResult");

exports.validateCreateBoard = [
	body("name").exists().isString().isLength({ min: "3", max: "20" }).custom((value, { req }) => {
		if (req.user.boards.find(b => b.name == value)) return false

		return true
	}),
	handleValidationResult,
];

exports.validateEditBoard = [
	param("id")
		.exists()
		.bail()
		.isString()
		.custom((value, { req }) => {
			const boardIndex = req.user.boards.findIndex(b => b._id == value)
			if (boardIndex === -1) return false

			req.boardIndex = boardIndex
			return true

		}).withMessage("board not found !"),
	body("name").exists().isString().isLength({ min: "3", max: "20" }).custom((value, { req }) => {
		if (req.user.boards[req.boardIndex]['name'] === value) return false
		else return true
	}).withMessage("board already exists !"),
	handleValidationResult,
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
	handleValidationResult,
]