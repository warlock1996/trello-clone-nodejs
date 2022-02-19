const express = require('express')
const router = express.Router()
const { validateSignUp, validateLogin, validateLink } = require('../validators/authValidators')
const validate = require('../validators/handleValidationResult')
const { handleSignUp, handleLogin, handleActivation, handleLogOut } = require('../controllers/authController')
const { checkAuth } = require('../middlewares/checkAuth')

router.post('/logout', checkAuth, handleLogOut)
router.post('/signup', validate(validateSignUp), handleSignUp)
router.post('/login', validate(validateLogin), handleLogin)
router.get('/activate/:hash', validate(validateLink), handleActivation)

module.exports = router
