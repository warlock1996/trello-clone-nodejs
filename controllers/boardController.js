const { Board } = require("../models/Board")
const { Task } = require("../models/Task")
const { OWNER_PERMISSIONS, MEMBER_PERMISSIONS } = require("../utils/samplepermissions")

exports.handleGetBoard = async (req, res) => {
    try {
        const boardIds = req.user.boards
        const userBoards = await Board.find({ _id: { $in: boardIds } }).exec()
        return res.json({ error: false, data: userBoards })
    } catch (error) {
        console.log(error)
    }
}
exports.handleCreateBoard = async (req, res) => {
    try {
        const user = req.user
        const defaultMember = { _id: user._id, name: user.name, permissions: OWNER_PERMISSIONS }
        const board = new Board({
            name: req.body.name,
            lists: [],
            members: [defaultMember]
        })
        await board.save()
        user.boards.push(board._id)
        await user.save()

        return res.json({
            error: false,
            data: board
        })
    } catch (error) {
        console.error(error)
    }
};

exports.handleEditBoard = async (req, res) => {
    try {

        const boardId = req.params.id, boardName = req.body.name
        const board = await Board.findByIdAndUpdate(boardId, { name: boardName }, {
            returnDocument: 'after'
        })
        if (!board) return res.json({ error: true, message: 'failed to edit board !' })

        return res.json({
            error: false,
            data: board
        })
    } catch (error) {
        console.error(error)
    }
};
exports.handleDeleteBoard = async (req, res) => {
    try {
        const user = req.user, boardId = req.params.id
        const board = await Board.findByIdAndDelete(boardId)
        if (!board) return res.json({ error: true, message: 'failed to delete board !' })
        user.boards = user.boards.filter((b) => b._id != boardId)
        await user.save()

        const tasksToBeDeleted = board.lists.flatMap(list => list.tasks)

        const results = await Task.deleteMany({ _id: { $in: tasksToBeDeleted } })

        return res.json({
            error: false,
            data: board,
            boardListTaskDetails: results
        })

    } catch (error) {
        console.error(error)
    }
};
