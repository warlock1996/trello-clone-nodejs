const express = require("express");
const router = express.Router();
// middlewares
const { checkAuth } = require("../middlewares/checkAuth");
// routes
const authRoutes = require("./authRoutes");
const boardRoutes = require("./boardRoutes");
const listRoutes = require("./listRoutes");

router.use("/api/account", authRoutes);
router.use("/api/board", checkAuth, boardRoutes);
router.use("/api/list", checkAuth, listRoutes);

module.exports = router;
