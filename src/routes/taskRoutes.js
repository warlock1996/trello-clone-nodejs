const express = require("express");
const router = express.Router();
const { checkPerms } = require("../middlewares/checkPerms")

const {
    validateIndexTask,
    validateCreateTask, validateEditTask, validateDeleteTask
} = require("../validators/taskValidators");
const validate  = require("../validators/handleValidationResult")
const {
    handleIndexTask,
    handleCreateTask, handleEditTask, handleDeleteTask
} = require("../controllers/taskController");

router.get("/index/:boardId/:listId/:taskId", checkPerms('task', 'read'), validate(validateIndexTask), handleIndexTask);
router.post("/create/:boardId/:listId/:taskId?", checkPerms('task', 'create'), validate(validateCreateTask), handleCreateTask);
router.post("/edit/:boardId/:listId/:taskId/:subtaskId?", checkPerms('task', 'update'), validate(validateEditTask), handleEditTask);
router.delete("/delete/:boardId/:listId/:taskId/:subtaskId?", checkPerms('task', 'delete'), validate(validateDeleteTask), handleDeleteTask);


module.exports = router;
