const { body, param, checkSchema } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const User = require("../models/User")
const { Task } = require("../models/Task")



exports.validateIndexList = [
    param("boardId").exists().isString().custom(value => isValidObjectId(value)).custom(async (value, { req }) => {
        const boardIndex = req.user.boards.findIndex(b => b._id == value)
        if (boardIndex === -1) return Promise.reject('board does not exist !')
        req.boardIndex = boardIndex
    }),
];

exports.validateCreateTask = [
    body('boardId').exists({ checkNull: true }).notEmpty().custom((value, { req }) => {
        if (!isValidObjectId(value)) throw new Error('invalid object id')
        const boardIndex = req.user.boards.findIndex(b => b._id == value)
        if (boardIndex === -1) throw new Error("board not found !")
        req.boardIndex = boardIndex
        return true
    }),
    body('listId').exists({ checkNull: true }).notEmpty().custom((value, { req }) => {
        if (!isValidObjectId(value)) throw new Error('invalid object id')
        const listIndex = req.user.boards[req.boardIndex]['lists'].findIndex(l => l._id == value)
        if (listIndex === -1) throw new Error("list not found !")
        req.listIndex = listIndex
        return true
    }),
    body('task').exists({ checkNull: true }).notEmpty().isLength({ min: 3, max: 20 }),
    body('assignee').exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) Promise.reject('invalid object id')
        const assignee = await User.findById(value)
        if (!assignee) Promise.reject('assignee not found !')
    }),
    body('reporter').exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) Promise.reject('invalid object id')
        const reporter = await User.findById(value)
        if (!reporter) Promise.reject("reporter not found !")
    }),
    body('parentTask').exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) Promise.reject('invalid object id')
        const parentTask = await Task.findById(value)
        if (!parentTask) Promise.reject("task not found !")
    }),
];

exports.validateEditList = [
    body("boardId").exists().isString().custom(value => isValidObjectId(value)).custom((value, { req }) => {
        if (!req.user.boards.find(b => b._id == value)) return false
        return true
    }),
    param("id")
        .exists()
        .bail()
        .isString()
        .custom((value, { req }) => {
            const boardIndex = req.user.boards.findIndex(b => b._id == req.body.boardId)
            if (boardIndex >= 0) {
                const listIndex = req.user.boards[boardIndex]['lists'].findIndex(l => l._id == value)
                if (listIndex === -1) return false
                req.boardIndex = boardIndex
                req.listIndex = listIndex
            } else {
                return false
            }
            return true
        }),
    body("name").exists().isString().isLength({ min: "3", max: "20" }).custom((value, { req }) => {
        if (req.user.boards[req.boardIndex]['lists'][req.listIndex]['name'] === value) return false
        return true
    }).withMessage("list name already exists !"),
];

exports.validateDeleteList = [
    body("boardId").exists().bail().isString().custom(value => isValidObjectId(value)).custom((value, { req }) => {
        const boardIndex = req.user.boards.findIndex(b => b._id == value)
        if (boardIndex === -1) return false

        req.boardIndex = boardIndex
        return true
    }),
    param("id")
        .exists()
        .bail()
        .isString()
        .custom(value => isValidObjectId(value)).custom((value, { req }) => {
            const listIndex = req.user.boards[req.boardIndex]['lists'].findIndex(l => l._id == value)
            if (listIndex === -1) return false

            req.listIndex = listIndex
            return true
        }),
]