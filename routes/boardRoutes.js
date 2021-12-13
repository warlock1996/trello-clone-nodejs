const express = require("express");
const router = express.Router();
const {
	validateCreateBoard,
	validateEditBoard,
	validateDeleteBoard,
	validateInviteUser,
	validateAcceptInvite
} = require("../validators/boardValidators");

const validate = require("../validators/handleValidationResult")
const {
	handleGetBoard,
	handleCreateBoard,
	handleEditBoard,
	handleDeleteBoard,
	handleInviteUser,
	handleAcceptInvitation
} = require("../controllers/boardController");

router.get("/index", handleGetBoard);
router.post("/create", validate(validateCreateBoard), handleCreateBoard);
router.post("/edit/:id", validate(validateEditBoard), handleEditBoard);
router.delete("/delete/:id", validate(validateDeleteBoard), handleDeleteBoard);
router.post("/invite/:boardId", validate(validateInviteUser), handleInviteUser);
router.get("/accept-invitation/:inviteToken", validate(validateAcceptInvite), handleAcceptInvitation);


module.exports = router;
