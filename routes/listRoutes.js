const express = require("express");
const router = express.Router();
const {
	validateIndexList,
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
} = require("../controllers/listController");

router.get("/index/:boardId", validate(validateIndexList), handleGetList);
router.post("/create", validate(validateCreateList), handleCreateList);
router.post("/edit/:id", validate(validateEditList), handleEditList);
router.delete("/delete/:id", validate(validateDeleteList), handleDeleteList);

module.exports = router;
