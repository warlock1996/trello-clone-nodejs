const { body, param } = require("express-validator");
const Project = require("../models/Project");
const handleValidationResult = require("./handleValidationResult");

exports.validateCreateProject = [
	body("name").exists().isString().isLength({ min: "3", max: "20" }),
	handleValidationResult,
];

exports.validateEditProject = [
	param("id")
		.exists()
		.bail()
		.isString()
		.custom(async (value, { req }) => {
			const project = await Project.findById(value);
			if (!project) return Promise.reject("Project not found !");
		}),
	body("name").exists().isString().isLength({ min: "3", max: "20" }),
	handleValidationResult,
];
