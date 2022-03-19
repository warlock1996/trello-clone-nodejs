require('./envconfig')()
const express = require('express')
const injectMiddleware = require('./src/utils/inject')
const connectDB = require('./dbconfig')

const app = express()
// inject middlewares
injectMiddleware(app)
// connect db first
connectDB().then(async () => {
	app.listen(process.env.PORT, () => {
		console.log('server running on port:', process.env.PORT)
	})
})
