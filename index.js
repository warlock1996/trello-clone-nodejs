
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./dbconfig");
const configureEnv = require("./envconfig")
const routes = require("./src/routes/index");

const app = express();

// setup env
configureEnv();

// inject middlewares
app.use(bodyParser.json());
app.use(routes);

// connect db first
connectDB().then(async () => {
	app.listen(process.env.PORT_NUMBER, () => {
		console.log("server running on port:", process.env.PORT_NUMBER);
	});
});
