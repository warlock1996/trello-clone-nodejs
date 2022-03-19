const express = require('express')
const router = express.Router()
const { checkPerms } = require('../middlewares/checkPerms')
const multer = require('../utils/multer')

const {
	validateIndexTask,
	validateCreateTask,
	validateEditTask,
	validateDeleteTask,
	validateGetTasksByList,
	validateMoveTask,
	validateCopyTask,
	validateTaskAttachmentUpload,
	validateCreateTaskComment,
	validateMakeCover,
} = require('../validators/taskValidators')
const validate = require('../validators/handleValidationResult')
const {
	handleIndexTask,
	handleCreateTask,
	handleEditTask,
	handleDeleteTask,
	handleGetTasksByList,
	handleMoveTask,
	handleCopyTask,
	handleTaskAttachmentUpload,
	handleCreateTaskComment,
	handleAttachmentMakeCover,
} = require('../controllers/taskController')

router.get('/index/:boardId/:listId/:taskId', checkPerms('task', 'read'), validate(validateIndexTask), handleIndexTask)

router.get(
	'/indexTasksByList/:boardId/:listId',
	checkPerms('task', 'read'),
	validate(validateGetTasksByList),
	handleGetTasksByList
)
router.post(
	'/copy/:fromBoardId/:toBoardId/:fromListId/:toListId/:taskId',
	checkPerms('task', 'update', 'fromBoardId'),
	checkPerms('task', 'update', 'toBoardId'),
	validate(validateCopyTask),
	handleCopyTask
)

router.post(
	'/move/:fromBoardId/:toBoardId/:fromListId/:toListId/:taskId',
	checkPerms('task', 'update', 'fromBoardId'),
	checkPerms('task', 'update', 'toBoardId'),
	validate(validateMoveTask),
	handleMoveTask
)

router.post(
	'/upload/:boardId/:listId/:taskId',
	checkPerms('task', 'update'),
	multer.array('files'),
	validate(validateTaskAttachmentUpload),
	handleTaskAttachmentUpload
)

router.post(
	'/attachment/makecover/:boardId/:listId/:taskId/:attachmentId',
	checkPerms('task', 'update'),
	validate(validateMakeCover),
	handleAttachmentMakeCover
)

router.post(
	'/comment/:boardId/:listId/:taskId',
	checkPerms('task', 'update'),
	validate(validateCreateTaskComment),
	handleCreateTaskComment
)

router.post('/create/:boardId/:listId', checkPerms('task', 'create'), validate(validateCreateTask), handleCreateTask)
router.post('/edit/:boardId/:listId/:taskId', checkPerms('task', 'update'), validate(validateEditTask), handleEditTask)
router.delete(
	'/delete/:boardId/:listId/:taskId',
	checkPerms('task', 'delete'),
	validate(validateDeleteTask),
	handleDeleteTask
)

module.exports = router
