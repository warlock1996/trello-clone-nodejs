const express = require("express");
const router = express.Router();
const {
    validateCreateTask, validateEditTask, validateDeleteTask
} = require("../validators/taskValidators");
const validate  = require("../validators/handleValidationResult")
const {
    handleCreateTask, handleEditTask, handleDeleteTask
} = require("../controllers/taskController");

router.post("/create/:boardId/:listId/:taskId?", validate(validateCreateTask), handleCreateTask);
router.post("/edit/:boardId/:listId/:taskId/:subtaskId?", validate(validateEditTask), handleEditTask);
router.delete("/delete/:boardId/:listId/:taskId/:subtaskId?", validate(validateDeleteTask), handleDeleteTask);


module.exports = router;
