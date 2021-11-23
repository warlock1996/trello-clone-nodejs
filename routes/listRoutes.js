const express = require("express");
const router = express.Router();
const {
	validateCreateList,
	validateEditList,
	validateDeleteList
} = require("../validators/listValidators");

const {
	handleCreateList,
	handleEditList,
	handleDeleteList,
} = require("../controllers/listController");

router.post("/create", validateCreateList, handleCreateList);
router.post("/edit/:id", validateEditList, handleEditList);
router.delete("/delete/:id", validateDeleteList, handleDeleteList);

module.exports = router;
