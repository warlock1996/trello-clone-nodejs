require("./envconfig").configureEnv();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./dbconfig");
const routes = require("./src/routes/index");
const app = express();

app.use(bodyParser.json());

app.use(routes);

// connect db first
connectDB().then(() => {
	app.listen(process.env.PORT_NUMBER, () => {
		console.log("server running on port:", process.env.PORT_NUMBER);
	});
});
