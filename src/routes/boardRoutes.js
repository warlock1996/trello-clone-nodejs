const express = require("express");
const router = express.Router();
const { checkPerms } = require("../middlewares/checkPerms")
const {
	validateCreateBoard,
	validateEditBoard,
	validateDeleteBoard,
	validateInviteUser,
	validateAcceptInvite
} = require("../validators/boardValidators");

const validate = require("../validators/handleValidationResult")
const {
	getBoard,
	handleIndexAllUserBoards,
	handleCreateBoard,
	handleDeleteBoard,
	handleInviteUser,
	handleAcceptInvitation,
	handleEditBoard,
} = require('../controllers/boardController')

router.post('/create', validate(validateCreateBoard), handleCreateBoard)
router.post('/edit/:boardId', checkPerms('board', 'update'), validate(validateEditBoard), handleEditBoard)
router.delete('/delete/:boardId', checkPerms('board', 'delete'), validate(validateDeleteBoard), handleDeleteBoard)
router.post('/invite/:boardId', checkPerms('board', 'update'), validate(validateInviteUser), handleInviteUser)
router.get('/accept-invitation/:inviteToken', validate(validateAcceptInvite), handleAcceptInvitation)
router.get('/allUserBoards', handleIndexAllUserBoards)
router.get('/:boardId', getBoard)


module.exports = router;
