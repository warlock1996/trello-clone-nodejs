const express = require("express");
const router = express.Router();
const {
	validateCreateProject,
	validateEditProject,
} = require("../validators/projectValidators");
const { checkID } = require("../validators/index");

const {
	handleCreateProject,
	handleEditProject,
	handleDeleteProject,
} = require("../controllers/projectController");

router.post("/create", validateCreateProject, handleCreateProject);
router.post("/edit/:id", checkID, validateEditProject, handleEditProject);
router.get("/delete/:id", checkID, handleDeleteProject);

module.exports = router;
