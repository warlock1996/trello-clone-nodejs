const express = require("express");
const router = express.Router();
const {
    validateIndexTask,
    validateCreateTask, validateEditTask, validateDeleteTask
} = require("../validators/taskValidators");
const validate  = require("../validators/handleValidationResult")
const {
    handleIndexTask,
    handleCreateTask, handleEditTask, handleDeleteTask
} = require("../controllers/taskController");

router.get("/index/:boardId/:listId/:taskId", validate(validateIndexTask), handleIndexTask);
router.post("/create/:boardId/:listId/:taskId?", validate(validateCreateTask), handleCreateTask);
router.post("/edit/:boardId/:listId/:taskId/:subtaskId?", validate(validateEditTask), handleEditTask);
router.delete("/delete/:boardId/:listId/:taskId/:subtaskId?", validate(validateDeleteTask), handleDeleteTask);


module.exports = router;
