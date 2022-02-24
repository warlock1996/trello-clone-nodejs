const express = require('express')
const bodyParser = require('body-parser')
const connectDB = require('./dbconfig')
const configureEnv = require('./envconfig')
const routes = require('./src/routes/index')
const cors = require('cors')

const app = express()

// setup env
configureEnv()

// inject middlewares
app.use('/static', express.static('uploads'))
app.use(cors())
app.use(bodyParser.json())
app.use(routes)

// connect db first
connectDB().then(async () => {
	app.listen(process.env.PORT, () => {
		console.log('server running on port:', process.env.PORT)
	})
})
