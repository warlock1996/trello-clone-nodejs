const cors = require('cors')
const bodyParser = require('body-parser')
const routes = require('../routes/index')
const express = require('express')

const inject = (app) => {
	app.use(cors())
	app.use(bodyParser.json())
	app.use(routes)
	app.use('/static', express.static('uploads'))
}

module.exports = inject
