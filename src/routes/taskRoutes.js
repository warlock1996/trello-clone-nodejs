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
} = require('../controllers/taskController')

router.get('/index/:boardId/:listId/:taskId', checkPerms('task', 'read'), validate(validateIndexTask), handleIndexTask)

router.get(
	'/indexTasksByList/:boardId/:listId',
	checkPerms('task', 'read'),
	validate(validateGetTasksByList),
	handleGetTasksByList
)
router.post(
	'/copy/:fromBoardId/:toBoardId/:fromListId/:toListId/:fromTaskId',
	// checkPerms('task', 'update'),
	validate(validateCopyTask),
	handleCopyTask
)

router.post(
	'/move/:fromBoardId/:toBoardId/:fromListId/:toListId/:taskId',
	// checkPerms('task', 'update'),
	validate(validateMoveTask),
	handleMoveTask
)

router.post(
	'/upload/:boardId/:listId/:taskId',
	multer.array('files'),
	validate(validateTaskAttachmentUpload),
	handleTaskAttachmentUpload
)

router.post('/comment/:boardId/:listId/:taskId', validate(validateCreateTaskComment), handleCreateTaskComment)

router.post(
	'/create/:boardId/:listId/:taskId?',
	checkPerms('task', 'create'),
	validate(validateCreateTask),
	handleCreateTask
)
router.post(
	'/edit/:boardId/:listId/:taskId/:subtaskId?',
	checkPerms('task', 'update'),
	validate(validateEditTask),
	handleEditTask
)
router.delete(
	'/delete/:boardId/:listId/:taskId/:subtaskId?',
	checkPerms('task', 'delete'),
	validate(validateDeleteTask),
	handleDeleteTask
)

module.exports = router
