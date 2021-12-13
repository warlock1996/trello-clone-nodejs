const { body, param } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const User = require("../models/User")
const { Task } = require("../models/Task")
const { Board } = require("../models/Board")



exports.validateIndexTask = [
    param("boardId").exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const board = await Board.findById(value)
        if (!board) return Promise.reject("board does not exist !")
        req.board = board
    }),
    param('listId').exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const listIndex = req.board.lists.findIndex(l => l._id == value)
        if (listIndex === -1) return Promise.reject("list does not exist for this board !")
        req.listIndex = listIndex
    }),
    param('taskId').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const task = await Task.findById(value)
        if (!task) return Promise.reject("task does not exist !")
        req.task = task
    }),
];

exports.validateCreateTask = [
    param("boardId").exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const board = await Board.findById(value)
        if (!board) return Promise.reject("board does not exist !")
        req.board = board
    }),
    param('listId').exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const listIndex = req.board.lists.findIndex(l => l._id == value)
        if (listIndex === -1) return Promise.reject("list does not exist for this board !")
        req.listIndex = listIndex
    }),
    param('taskId').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const task = await Task.findById(value)
        if (!task) return Promise.reject("task does not exist !")
        req.task = task
    }),
    body('task').exists({ checkNull: true, checkFalsy: true }).bail().notEmpty().bail().isLength({ min: 3, max: 20 }),
    body('description').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 10, max: 30 }),
    body('assignee').exists({ checkNull: true }).bail().notEmpty().bail().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const assignee = await User.findById(value)
        if (!assignee) return Promise.reject('assignee not found !')
    }),
    body('priority').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 3, max: 20 }),
    body('reporter').exists({ checkNull: true }).bail().notEmpty().bail().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const reporter = await User.findById(value)
        if (!reporter) return Promise.reject("reporter not found !")
    })
];

exports.validateEditTask = [
    param("boardId").exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const board = await Board.findById(value)
        if (!board) return Promise.reject("board does not exist !")
        req.board = board
    }),
    param('listId').exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const listIndex = req.board.lists.findIndex(l => l._id == value)
        if (listIndex === -1) return Promise.reject("list does not exist for this board !")
    }),
    param('taskId').exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const task = await Task.findById(value)
        if (!task) return Promise.reject("task does not exist !")
        req.task = task
    }),
    param('subtaskId').optional().bail().exists({ checkNull: true, checkFalsy: true }).notEmpty().custom((value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const subtaskIndex = req.task.subtasks.findIndex(st => st._id == value)
        if (subtaskIndex === -1) throw new Error("subtask does not exist for this task !")
        req.subtaskIndex = subtaskIndex

        return true
    }),
    body('task').exists({ checkNull: true, checkFalsy: true }).bail().notEmpty().bail().isLength({ min: 3, max: 20 }),
    body('description').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 10, max: 30 }),
    body('assignee').exists({ checkNull: true }).bail().notEmpty().bail().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const assignee = await User.findById(value)
        if (!assignee) return Promise.reject('assignee not found !')
    }),
    body('priority').optional().exists({ checkNull: true, checkFalsy: true }).notEmpty().isString().isLength({ min: 3, max: 20 }),
    body('reporter').exists({ checkNull: true }).bail().notEmpty().bail().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const reporter = await User.findById(value)
        if (!reporter) return Promise.reject("reporter not found !")
    })
];

exports.validateDeleteTask = [
    param("boardId").exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const board = await Board.findById(value)
        if (!board) return Promise.reject("board does not exist !")
        req.board = board
    }),
    param('listId').exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const listIndex = req.board.lists.findIndex(l => l._id == value)
        if (listIndex === -1) return Promise.reject("list does not exist for this board !")
        req.listIndex = listIndex
    }),
    param('taskId').exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const task = await Task.findById(value)
        if (!task) return Promise.reject("task does not exist !")
        req.task = task
    }),
    param('subtaskId').optional().bail().exists({ checkNull: true, checkFalsy: true }).notEmpty().custom(async (value, { req }) => {
        if (!isValidObjectId(value)) return Promise.reject('invalid object id')
        const subtaskIndex = req.task.subtasks.findIndex(st => st._id == value)
        if (subtaskIndex === -1) return Promise.reject("subtask does not exist for this task !")
        req.subtaskIndex = subtaskIndex
    }),
]

