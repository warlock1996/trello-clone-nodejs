const { Board } = require("../models/Board")
const { Task } = require("../models/Task")
const { mail } = require("../utils/mailer");
const { sign } = require("../utils/jwt");
const mongoose = require("mongoose")

const { OWNER_PERMISSIONS, MEMBER_PERMISSIONS } = require("../utils/samplepermissions")

exports.handleGetBoard = async (req, res) => {
    try {
        const boardIds = req.user.boards
        const userBoards = await Board.find({ _id: { $in: boardIds } }).exec()
        return res.json({ error: false, data: userBoards })
    } catch (error) {
        console.error(error)
    }
}
exports.handleCreateBoard = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const user = req.user
        const defaultMember = { _id: user._id, name: user.name, permissions: OWNER_PERMISSIONS }
        const board = new Board({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            lists: [],
            members: [defaultMember]
        })
        await board.save({ session })
        user.boards.push(board._id)
        await user.save({ session })
        await session.commitTransaction()

        return res.json({
            error: false,
            data: board
        })
    } catch (error) {
        console.error(error)
        return res.status(500).send()
    } finally {
        await session.endSession()
    }
};
exports.handleEditBoard = async (req, res) => {
    try {

        const boardId = req.params.boardId, boardName = req.body.name
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
        const user = req.user, boardId = req.params.boardId
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

exports.handleInviteUser = async (req, res) => {
    const boardId = req.params.boardId, emails = req.body.emails
    emails.forEach(async (email) => {
        const inviteToken = await sign({ email, boardId })
        await mail(email, 'Board Invite', 'you are invited to the trello board !',
            `<a href=${req.protocol}://${req.hostname}:5000/api/board/accept-invitation/${inviteToken}>
				Accept Invitation
			</a>`
        )
    })
    return res.json({ error: false, message: 'invites sent !' })
}

exports.handleAcceptInvitation = async (req, res) => {
    const { boardId } = req.decodedInviteToken
    const member = { _id: req.user._id, name: req.user.name, permissions: MEMBER_PERMISSIONS }

    const isUserMember = req.board.members.findIndex(mem => mem._id == req.user._id)
    const boardIndex = req.user.boards.findIndex(bid => bid == boardId)

    if (isUserMember >= 0)
        return res.json({ error: true, message: 'user is already a member !' })

    if (boardIndex >= 0)
        return res.json({ error: true, message: 'board already exists in user list !' })


    req.board.members.push(member)
    req.user.boards.push(boardId)
    await req.board.save()
    await req.user.save()

    return res.json({ error: false, message: 'invitation accepted !' })
}
