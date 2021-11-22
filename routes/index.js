const express = require("express");
const router = express.Router();
// middlewares
const { checkAuth } = require("../middlewares/checkAuth");
// routes
const authRoutes = require("./authRoutes");
const projectRoutes = require("./projectRoutes");

router.use("/api/account", authRoutes);
router.use("/api/project", checkAuth, projectRoutes);

module.exports = router;
