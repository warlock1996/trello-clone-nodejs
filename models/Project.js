const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
	name: String,
});

module.exports = mongoose.model("Project", ProjectSchema);
