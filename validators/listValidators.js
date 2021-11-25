const { body, param } = require("express-validator");
const { isValidObjectId } = require("mongoose");



exports.validateIndexList = [
    param("boardId").exists().isString().custom(value => isValidObjectId(value)).custom(async (value, { req }) => {
        const boardIndex = req.user.boards.findIndex(b => b._id == value)
        if (boardIndex === -1) return Promise.reject('board does not exist !')
        req.boardIndex = boardIndex
    }),
];

exports.validateCreateList = [
    body("name").exists().isString().isLength({ min: "3", max: "20" }),
    body("boardId").exists().isString().custom(value => isValidObjectId(value)),
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