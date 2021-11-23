const User = require("../models/User")
const { Board } = require("../models/Board")

exports.handleCreateBoard = async (req, res) => {
    try {
        const user = req.user
        const board = new Board({
            name: req.body.name
        })
        user.boards.push(board)
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

        const user = req.user
        user.boards[req.boardIndex]['name'] = req.body.name
        await user.save()
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
        const user = req.user
        user.boards = user.boards.filter((b) => b._id != req.params.id)
        await user.save()
        res.json({
            error: false,
            message: "board deleted !"
        })

    } catch (error) {
        console.error(error)
    }
};
