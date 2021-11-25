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
    body('description').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 10, max: 30 }),
    body('assignee').exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const assignee = await User.findById(value)
        if (!assignee) return Promise.reject('assignee not found !')
    }),
    body('priority').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 3, max: 20 }),
    body('reporter').exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const reporter = await User.findById(value)
        if (!reporter) return Promise.reject("reporter not found !")
    }),
    body('parentTask').optional().exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const parentTask = await Task.findById(value)
        if (!parentTask) return Promise.reject("task not found !")
    }),
];

exports.validateEditTask = [
    param('id').exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().custom(async (value) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const parentTask = await Task.findById(value)
        if (!parentTask) return Promise.reject("task not found !")
    }),
    body('task').optional().exists({ checkNull: true }).notEmpty().isLength({ min: 3, max: 20 }),
    body('description').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 10, max: 30 }),
    body('assignee').optional().exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const assignee = await User.findById(value)
        if (!assignee) return Promise.reject('assignee not found !')
    }),
    body('priority').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 3, max: 20 }),
    body('reporter').optional().exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const reporter = await User.findById(value)
        if (!reporter) return Promise.reject("reporter not found !")
    }),
    body('parentTask').optional().exists({ checkNull: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const parentTask = await Task.findById(value)
        if (!parentTask) return Promise.reject("task not found !")
    }),
];

exports.validateDeleteTask = [
    param('id').exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().custom(async (value) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const task = await Task.findById(value)
        if (!task) return Promise.reject("task not found !")
    }),
    body("boardId").exists().bail().isString().custom(value => isValidObjectId(value)).custom((value, { req }) => {
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

]

