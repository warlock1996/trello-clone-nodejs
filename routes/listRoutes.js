const express = require("express");
const router = express.Router();
const {
	validateIndexList,
	validateGetTasksByList,
	validateCreateList,
	validateEditList,
	validateDeleteList
} = require("../validators/listValidators");
const validate = require("../validators/handleValidationResult")

const {
	handleGetList,
	handleCreateList,
	handleEditList,
	handleDeleteList,
	handleGetTasksByList,
} = require("../controllers/listController");

router.get("/index/:boardId", validate(validateIndexList), handleGetList);
router.get("/indexTasksByList/:boardId/:listId", validate(validateGetTasksByList), handleGetTasksByList);
router.post("/create", validate(validateCreateList), handleCreateList);
router.post("/edit/:boardId/:listId", validate(validateEditList), handleEditList);
router.delete("/delete/:boardId/:listId", validate(validateDeleteList), handleDeleteList);

module.exports = router;
