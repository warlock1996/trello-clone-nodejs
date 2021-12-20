const express = require("express");
const router = express.Router();
const { checkPerms } = require("../middlewares/checkPerms")
const {
	validateIndexList,
	validateGetTasksByList,
	validateCreateList,
	validateEditList,
	validateDeleteList,
	validateMoveTask
} = require("../validators/listValidators");
const validate = require("../validators/handleValidationResult")

const {
	handleGetList,
	handleCreateList,
	handleEditList,
	handleDeleteList,
	handleGetTasksByList,
	handleMoveTask,
} = require("../controllers/listController");

router.get("/index/:boardId", checkPerms('list', 'read'), validate(validateIndexList), handleGetList);
router.get("/indexTasksByList/:boardId/:listId", checkPerms('list', 'read'), validate(validateGetTasksByList), handleGetTasksByList);
router.post("/move/:boardId/:fromListId/:toListId/:taskId", checkPerms('list', 'update'), validate(validateMoveTask), handleMoveTask);
router.post("/create/:boardId", checkPerms('list', 'create'), validate(validateCreateList), handleCreateList);
router.post("/edit/:boardId/:listId", checkPerms('list', 'update'), validate(validateEditList), handleEditList);
router.delete("/delete/:boardId/:listId", checkPerms('list', 'delete'), validate(validateDeleteList), handleDeleteList);

module.exports = router;
