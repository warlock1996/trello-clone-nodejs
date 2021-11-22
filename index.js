require("./envconfig").configureEnv();
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./dbconfig");
const routes = require("./routes/index");
const app = express();

app.use(bodyParser.json());

app.use(routes);

// connect db first
connectDB().then(() => {
	app.listen(5000, () => {
		console.log("server running on port:5000");
	});
});