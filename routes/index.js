const express = require("express");
const router = express.Router();
// middlewares
const { checkAuth } = require("../middlewares/checkAuth");
// routes
const authRoutes = require("./authRoutes");
const boardRoutes = require("./boardRoutes");

router.use("/api/account", authRoutes);
router.use("/api/board", checkAuth, boardRoutes);

module.exports = router;
