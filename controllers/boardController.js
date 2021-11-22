const User = require("../models/User")
const Board = require("../models/Board")

exports.handleCreateBoard = async (req, res) => {
    try {
        const user = req.user
        const board = new Board({
            name: req.body.name
        })
        await board.save()
        user.boards.push(board._id)
        await user.save()
        res.json({
            error: false,
            message: 'success'
        })
    } catch (error) {
        console.error(error)
    }
};

exports.handleEditBoard = async (req, res) => {
    try {
        const board = req.board
        board.name = req.body.name
        await board.save()
        res.json({
            error: false,
            message: 'success'
        })
    } catch (error) {
        console.error(error)
    }
};
exports.handleDeleteBoard = async (req, res) => {
    try {
        const board = req.board
        const user = req.user
        user.boards = user.boards.filter((b) => b != board._id.toString())
        await user.save()
        await board.delete()
        res.json({
            error: false,
            message: "board deleted !"
        })

    } catch (error) {
        console.error(error)
    }
};
