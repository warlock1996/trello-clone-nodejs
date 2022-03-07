const mongoose = require('mongoose');
let db;
const getConnection = async () => {
        try {
            if (db) return db
            db = await mongoose.connect(process.env.MONGO_URI_PROD)
            console.log("DB connected !")
            return db
            
        } catch (error) {
            console.error(error.message)
        }
}
module.exports = getConnection

