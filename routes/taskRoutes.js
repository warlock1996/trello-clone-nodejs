const express = require("express");
const router = express.Router();
const {
    validateCreateTask, validateEditTask, validateDeleteTask
} = require("../validators/taskValidators");
const validate  = require("../validators/handleValidationResult")
const {
    handleCreateTask, handleEditTask, handleDeleteTask
} = require("../controllers/taskController");

router.post("/create", validate(validateCreateTask), handleCreateTask);
router.post("/edit/:id", validate(validateEditTask), handleEditTask);
router.delete("/delete/:id", validate(validateDeleteTask), handleDeleteTask);


module.exports = router;
