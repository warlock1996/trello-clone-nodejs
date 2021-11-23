const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema({
    name: String,
    tasks: [mongoose.Types.ObjectId],
}, { timestamps: true });


exports.ListSchema = ListSchema
exports.List = mongoose.model("List", ListSchema);
