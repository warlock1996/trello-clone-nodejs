const mongoose = require('mongoose');
let db;
const getConnection = async () => {
        try {
            if (db) return db
            db = await mongoose.connect('mongodb://localhost:27017/practice');
            console.log("DB connected !")
            return db
            
        } catch (error) {
            console.error(error.message)
        }
}
module.exports = getConnection

