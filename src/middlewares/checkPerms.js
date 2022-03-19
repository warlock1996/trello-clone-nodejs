const { isValidObjectId } = require('mongoose')
const { Board } = require('../models/Board')
const { handleError } = require('../utils/error')

//moduleId will be boardId, we only check boardLevel Permissions

exports.checkPerms = (module, perm, moduleId = 'boardId') => {
	return async (req, res, next) => {
		try {
			const boardId = req.params[moduleId]

			if (!isValidObjectId(boardId)) return res.json({ error: true, message: 'invalid request payload !' })

			const board = await Board.findById(boardId)
			if (!board) return res.status(401).json({ error: true, message: 'board doest not exist !' })

			const memberIndex = board.members.findIndex((mem) => mem._id.toString() == req.user._id.toString())
			if (memberIndex === -1)
				return res.status(401).json({ error: true, message: 'you dont have permission to access this resource!' })

			const perms = board.members[memberIndex]['permissions'][module]
			if (!perms[perm]) return res.status(401).json({ error: true, message: `you dont have ${perm} permission !` })
			return next()
		} catch (error) {
			handleError(error, res)
		}
	}
}
