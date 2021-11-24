const express = require("express");
const router = express.Router();
const {
    validateCreateTask
} = require("../validators/taskValidators");
const validate  = require("../validators/handleValidationResult")
const {
    handleCreateTask
} = require("../controllers/taskController");

router.post("/create", validate(validateCreateTask), handleCreateTask);

module.exports = router;
