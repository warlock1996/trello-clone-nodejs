const express = require('express')
const router = express.Router()
const { checkPerms } = require('../middlewares/checkPerms')
const {
	validateCreateBoard,
	validateEditBoard,
	validateDeleteBoard,
	validateInviteUser,
	validateAcceptInvite,
	validateSearchMembers,
} = require('../validators/boardValidators')

const validate = require('../validators/handleValidationResult')
const {
	handleGetBoardById,
	handleGetAllUserBoards,
	handleCreateBoard,
	handleDeleteBoard,
	handleInviteUser,
	handleAcceptInvitation,
	handleEditBoard,
	handleSearchMembers,
} = require('../controllers/boardController')

router.get('/:boardId', checkPerms('board', 'read'), handleGetBoardById)
router.post('/create', validate(validateCreateBoard), handleCreateBoard)
router.post('/edit/:boardId', checkPerms('board', 'update'), validate(validateEditBoard), handleEditBoard)
router.delete('/delete/:boardId', checkPerms('board', 'delete'), validate(validateDeleteBoard), handleDeleteBoard)
router.post('/invite/:boardId', checkPerms('board', 'update'), validate(validateInviteUser), handleInviteUser)
router.get('/accept-invitation/:inviteToken', validate(validateAcceptInvite), handleAcceptInvitation)
router.get('/allUserBoards', handleGetAllUserBoards)
router.get(
	'/:boardId/search-members',
	checkPerms('board', 'read'),
	validate(validateSearchMembers),
	handleSearchMembers
)

module.exports = router
