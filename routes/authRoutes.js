const express = require("express");
const router = express.Router();
const {
	validateSignUp,
	validateLogin,
	validateLink,
} = require("../validators/authValidators");
const {
	handleSignUp,
	handleLogin,
	handleActivation,
} = require("../controllers/authController");

router.post("/signup", validateSignUp, handleSignUp);
router.post("/login", validateLogin, handleLogin);
router.get("/activate/:hash", validateLink, handleActivation);



module.exports = router;
