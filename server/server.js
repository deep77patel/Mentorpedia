// load up the express framework and body-parser helper
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// create an instance of express to serve our end points
const app = express();

// we'll load up node's built in file system helper library here
// (we'll be using this later to serve our JSON files
const fs = require("fs");

// configure our express instance with some body-parser settings
// including handling JSON data

app.use(cors());

app.use(function (req, res, next) {
	// Website you wish to allow to connect
	// res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

	res.setHeader("Access-Control-Allow-Origin", "*");

	// Request methods you wish to allow
	res.setHeader("Access-Control-Allow-Methods", "POST");

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", true);

	// Pass to next layer of middleware
	next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// this is where we'll handle our various routes from
const routes = require("./Routes/routes")(app, fs);

// finally, launch our server on port 3001.
const server = app.listen(3001, () => {
	console.log("listening on port %s...", server.address().port);
});
