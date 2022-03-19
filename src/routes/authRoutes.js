const express = require('express')
const router = express.Router()
const validate = require('../validators/handleValidationResult')
const { validateSignUp, validateLogin, validateLink } = require('../validators/authValidators')
const { handleSignUp, handleLogin, handleActivation, handleLogOut } = require('../controllers/authController')
const checkAuth = require('../middlewares/checkAuth')

router.post('/signup', validate(validateSignUp), handleSignUp)
router.post('/login', validate(validateLogin), handleLogin)
router.get('/activate/:hash', validate(validateLink), handleActivation)
router.post('/logout', checkAuth, handleLogOut)

module.exports = router
