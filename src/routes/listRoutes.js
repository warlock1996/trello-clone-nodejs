const express = require('express')
const router = express.Router()
const { checkPerms } = require('../middlewares/checkPerms')
const {
	validateIndexList,
	validateCreateList,
	validateEditList,
	validateDeleteList,
} = require('../validators/listValidators')
const validate = require('../validators/handleValidationResult')

const { handleGetList, handleCreateList, handleEditList, handleDeleteList } = require('../controllers/listController')

router.get('/index/:boardId', checkPerms('list', 'read'), validate(validateIndexList), handleGetList)
router.post('/create/:boardId', checkPerms('list', 'create'), validate(validateCreateList), handleCreateList)
router.post('/edit/:boardId/:listId', checkPerms('list', 'update'), validate(validateEditList), handleEditList)
router.delete('/delete/:boardId/:listId', checkPerms('list', 'delete'), validate(validateDeleteList), handleDeleteList)

module.exports = router
