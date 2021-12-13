const { Board } = require("../models/Board")

exports.checkPerms = (module, perm) => {
    return async (req, res, next) => {
        const board = await Board.findById(req.params.boardId)
        if (!board) return res.status(401).json({ error: true, message: 'board doest not exist !' })
        const memberIndex = board.members.findIndex(mem => mem._id.toString() == req.user._id.toString())
        if (memberIndex === -1) return res.status(401).json({ error: true, message: 'you dont have permission to access this resource!' })
        const perms = board.members[memberIndex]['permissions'][module]
        if (!perms[perm]) return res.status(401).json({ error: true, message: `you dont have ${perm} permission !` })
        return next()
    }
}