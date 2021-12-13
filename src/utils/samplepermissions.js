
exports.OWNER_PERMISSIONS = {
    board: {
        create: true,
        read: true,
        update: true,
        delete: true
    },
    list: {
        create: true,
        read: true,
        update: true,
        delete: true
    },
    task: {
        create: true,
        read: true,
        update: true,
        delete: true
    },
}


exports.MEMBER_PERMISSIONS = {
    board: {
        create: false,
        read: true,
        update: true,
        delete: false
    },
    list: {
        create: true,
        read: true,
        update: true,
        delete: false
    },
    task: {
        create: true,
        read: true,
        update: true,
        delete: false
    },
}