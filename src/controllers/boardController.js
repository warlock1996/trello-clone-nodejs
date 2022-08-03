const mongoose = require('mongoose')
const { Board } = require('../models/Board')
const { Task } = require('../models/Task')
const { mail } = require('../utils/mailer')
const { sign } = require('../utils/jwt')
const { handleError } = require('../utils/error')

const { OWNER_PERMISSIONS, MEMBER_PERMISSIONS } = require('../utils/samplepermissions')
const { matchedData } = require('express-validator')
const Labels = require('../utils/samplelabels')
const User = require('../models/User')

exports.handleGetBoardById = async (req, res) => {
	try {
		const board = await Board.findById(req.params.boardId)
		return res.json({
			error: false,
			data: board,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleGetAllUserBoards = async (req, res) => {
	try {
		const allboards = await Board.find({ 'members._id': req.user._id }).exec()
		const createdBoards = [],
			invitedBoards = []
		allboards.forEach((board) => {
			if (board.userId.toString() == req.user._id) {
				createdBoards.push(board)
				return
			}
			invitedBoards.push(board)
		})
		return res.json({
			error: false,
			data: {
				createdBoards,
				invitedBoards,
			},
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleCreateBoard = async (req, res) => {
	try {
		const user = req.user
		const defaultMember = {
			_id: user._id,
			name: user.name,
			email: user.email,
			permissions: OWNER_PERMISSIONS,
		}
		const board = new Board({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			lists: [],
			labels: Labels,
			members: [defaultMember],
			userId: user._id,
			starred: false,
		})
		await board.save()
		return res.json({
			error: false,
			data: board,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleEditBoard = async (req, res) => {
	try {
		const validatedData = matchedData(req, { locations: ['body'] })
		const board = await Board.findByIdAndUpdate(req.params.boardId, validatedData, {
			returnDocument: 'after',
		})
		if (!board) return res.json({ error: true, message: 'failed to edit board !' })

		return res.json({
			error: false,
			data: board,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleDeleteBoard = async (req, res) => {
	try {
		const boardId = req.params.boardId
		const board = await Board.findByIdAndDelete(boardId)
		if (!board) return res.json({ error: true, message: 'failed to delete board !' })

		const tasksToBeDeleted = board.lists.flatMap((list) => list.tasks)

		const deletedTasks = await Task.deleteMany({ _id: { $in: tasksToBeDeleted } })

		return res.json({
			error: false,
			data: board,
			deletedTasks,
		})
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleInviteUser = async (req, res) => {
	try {
		const promises = req.body.emails.map(async (email) => {
			const inviteToken = await sign({ email, boardId: req.params.boardId, board: req.board.name })
			return mail(
				email,
				'Board Invite',
				'you are invited to the trello board !',
				`<a href=${process.env.FRONTEND_SERVER_ADDR}/accept-invitation/${inviteToken}>
				Accept Invitation
			</a>`
			)
		})
		const settled = await Promise.allSettled(promises)
		const acceptedEmails = settled.filter(({ accepted }) => req.body.emails.includes(accepted))
		return res.json({ error: false, message: 'invites sent to the following emails !', data: acceptedEmails })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleAcceptInvitation = async (req, res) => {
	try {
		const member = {
			_id: req.user._id,
			name: req.user.name,
			email: req.user.email,
			permissions: MEMBER_PERMISSIONS,
		}

		const isUserMember = req.board.members.findIndex((mem) => mem._id == req.user._id)

		if (isUserMember >= 0) return res.json({ error: true, message: 'user is already a member !' })

		req.board.members.push(member)
		await req.board.save()

		return res.json({ error: false, message: `you have been added as a collaborator to ${req.board.name}` })
	} catch (error) {
		handleError(error, res)
	}
}

exports.handleSearchMembers = async (req, res) => {
	try {
		const { members } = await Board.findById(req.params.boardId, { 'members._id': 1, _id: -1 }).lean()
		const results = await User.find(
			{ _id: { $not: { $in: members } }, email: { $regex: req.query.search, $options: 'i' } },
			{
				name: 1,
				email: 1,
			}
		)
			.lean()
			.exec()
		return res.json({
			error: false,
			data: results,
		})
	} catch (error) {
		handleError(error, res)
	}
}
