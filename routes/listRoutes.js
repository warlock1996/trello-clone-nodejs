const express = require("express");
const router = express.Router();
const {
	validateIndexList,
	validateCreateList,
	validateEditList,
	validateDeleteList
} = require("../validators/listValidators");

const {
	handleGetList,
	handleCreateList,
	handleEditList,
	handleDeleteList,
} = require("../controllers/listController");

router.get("/index/:boardId", validateIndexList, handleGetList);
router.post("/create", validateCreateList, handleCreateList);
router.post("/edit/:id", validateEditList, handleEditList);
router.delete("/delete/:id", validateDeleteList, handleDeleteList);

module.exports = router;
