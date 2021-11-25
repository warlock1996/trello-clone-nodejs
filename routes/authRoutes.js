const express = require("express");
const router = express.Router();
const {
	validateSignUp,
	validateLogin,
	validateLink,
} = require("../validators/authValidators");
const validate = require("../validators/handleValidationResult")
const {
	handleSignUp,
	handleLogin,
	handleActivation,
} = require("../controllers/authController");

router.post("/signup", validate(validateSignUp), handleSignUp);
router.post("/login", validate(validateLogin), handleLogin);
router.get("/activate/:hash", validate(validateLink), handleActivation);



module.exports = router;
