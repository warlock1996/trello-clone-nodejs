const User = require("../models/User")
const { List } = require("../models/List")

exports.handleCreateList = async (req, res) => {
    try {
        const user = req.user
        const boardId = req.body.boardId
        const list = new List({
            name: req.body.name
        })

        const boardIndex = user.boards.findIndex(b => b._id == boardId)
        if (boardIndex === -1) return res.json({ error: true, message: 'board not found' })

        const boardLists = user.boards[boardIndex]['lists']
        if (boardLists.find(l => l.name === req.body.name)) {
            return res.json({ error: true, message: 'list name already exists' })
        }
        user.boards[boardIndex]['lists'].push(list)
        await user.save()

        return res.json({
            error: false,
            message: 'success'
        })
    } catch (error) {
        console.error(error)
    }
};

exports.handleEditList = async (req, res) => {
    try {
        const user = req.user, boardIndex = req.boardIndex, listIndex = req.listIndex
        user.boards[boardIndex]['lists'][listIndex]['name'] = req.body.name
        await user.save()
        return res.json({
            error: false,
            message: 'list updated successfully !'
        })
    } catch (error) {
        console.error(error)
    }
};
exports.handleDeleteList = async (req, res) => {
    try {
        const user = req.user, boardIndex = req.boardIndex, listIndex = req.listIndex
        const id = user.boards[boardIndex]['lists'][listIndex]['_id']
        user.boards[boardIndex]['lists'] = user.boards[boardIndex]['lists'].filter(l => l._id != id)
        await user.save()
        return res.json({
            error: false,
            message: "list deleted successfully !"
        })

    } catch (error) {
        console.error(error)
    }
};
