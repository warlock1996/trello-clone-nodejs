const { body, param } = require("express-validator");
const Board = require("../models/Board");
const handleValidationResult = require("./handleValidationResult");

exports.validateCreateBoard = [
	body("name").exists().isString().isLength({ min: "3", max: "20" }).custom(async (value) => {
		const board = await Board.findOne({ name: value })
		if (board) return Promise.reject('board name already exists')
	}),
	handleValidationResult,
];

exports.validateEditBoard = [
	param("id")
		.exists()
		.bail()
		.isString()
		.custom(async (value, { req }) => {
			const board = await Board.findById(value);
			if (!board) return Promise.reject("Board not found !");
			if (board.name === req.body.name) return Promise.reject("Board should have new name")
			req.board = board
		}),
	body("name").exists().isString().isLength({ min: "3", max: "20" }),
	handleValidationResult,
];

exports.validateDeleteBoard = [
	param("id")
		.exists()
		.bail()
		.isString()
		.custom(async (value, { req }) => {
			const board = await Board.findById(value);
			if (!board) return Promise.reject("Board not found !");
			req.board = board
		}),
	handleValidationResult,
]