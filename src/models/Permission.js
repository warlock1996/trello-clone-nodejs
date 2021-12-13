const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    board: { type: Object },
    list: { type: Object },
    task: { type: Object },
})

// const RoleSchema = new mongoose.Schema({
// 	 _id: mongoose.Types.ObjectId,
// 	 name: String,
// 	 permissions: PermissionSchema
// })


exports.PermissionSchema = PermissionSchema
// exports.Permission = mongoose.model("Permissions", PermissionSchema)