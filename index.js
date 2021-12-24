
if (process.env.NODE_ENV === 'development') {
	require("./envconfig").configureEnv();
}
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./dbconfig");
const routes = require("./src/routes/index");
const app = express();

const { Task } = require("./src/models/Task")

app.use(bodyParser.json());

app.use(routes);



app.use('/', (req, res) => {
	res.render('<h1>Hi, from server !</h1>')
})

// connect db first
connectDB().then(async () => {
	app.listen(process.env.PORT_NUMBER, () => {
		console.log("server running on port:", process.env.PORT_NUMBER);
	});
});
