const express = require("express");
const router = express.Router();
// middlewares
const checkAuth = require('../middlewares/checkAuth')
// routes
const authRoutes = require('./authRoutes')
const boardRoutes = require('./boardRoutes')
const listRoutes = require('./listRoutes')
const taskRoutes = require('./taskRoutes')

router.use('/api/account', authRoutes)
router.use('/api/board', checkAuth, boardRoutes)
router.use('/api/list', checkAuth, listRoutes)
router.use('/api/task', checkAuth, taskRoutes)
router.use('/api/*', (req, res) => {
	return res.json({
		error: true,
		message: 'This route may have been changed or it doesnt exist at all !',
	})
})

module.exports = router;
