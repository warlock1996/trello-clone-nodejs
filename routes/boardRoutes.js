const express = require("express");
const router = express.Router();
const {
	validateCreateBoard,
	validateEditBoard,
	validateDeleteBoard
} = require("../validators/boardValidators");

const validate = require("../validators/handleValidationResult")
const {
	handleGetBoard,
	handleCreateBoard,
	handleEditBoard,
	handleDeleteBoard,
} = require("../controllers/boardController");

router.get("/index", handleGetBoard);
router.post("/create", validate(validateCreateBoard), handleCreateBoard);
router.post("/edit/:id", validate(validateEditBoard), handleEditBoard);
router.delete("/delete/:id", validate(validateDeleteBoard), handleDeleteBoard);

module.exports = router;
