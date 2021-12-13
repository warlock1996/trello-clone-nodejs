
exports.OWNER_PERMISSIONS = {
    boardPermissions: {
        create: true,
        read: true,
        update: true,
        delete: true
    },
    listPermissions: {
        create: true,
        read: true,
        update: true,
        delete: true
    },
    taskPermissions: {
        create: true,
        read: true,
        update: true,
        delete: true
    },
}


exports.MEMBER_PERMISSIONS = {
    boardPermissions: {
        create: false,
        read: true,
        update: true,
        delete: false
    },
    listPermissions: {
        create: true,
        read: true,
        update: true,
        delete: false
    },
    taskPermissions: {
        create: true,
        read: true,
        update: true,
        delete: false
    },
}