const mongoose = require('mongoose')
let db
const getConnection = async () => {
	try {
		if (db) return db
		const URI = process.env.NODE_ENV === 'development' ? process.env.MONGO_URI_PROD : process.env.MONGO_URI_PROD
		db = await mongoose.connect(URI)
		console.log('DB connected !')
		return db
	} catch (error) {
		console.error('Error:', error.message)
	}
}
module.exports = getConnection
