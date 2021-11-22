const express = require("express");
const router = express.Router();
const {
	validateCreateBoard,
	validateEditBoard,
	validateDeleteBoard
} = require("../validators/boardValidators");
const { checkID } = require("../validators/index");

const {
	handleCreateBoard,
	handleEditBoard,
	handleDeleteBoard,
} = require("../controllers/boardController");

router.post("/create", validateCreateBoard, handleCreateBoard);
router.post("/edit/:id", checkID, validateEditBoard, handleEditBoard);
router.delete("/delete/:id", validateDeleteBoard, handleDeleteBoard);

module.exports = router;
