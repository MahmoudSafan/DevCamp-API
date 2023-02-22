// import external lib
const express = require("express");
const morgan = require("morgan");
const colors = require("colors");

// import internal modules
const dbConnect = require("./config/db.js");
const config = require("./config/config.js");
const api = require("./routs/routeNavigator.js");

const app = express();

// connect to mongoose
dbConnect();

// run logger only on development environment
if (config.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// configure routs
app.use("/api/v1", api);

const server = app.listen(config.PORT, () => {
	console.log(
		`server running on ${config.NODE_ENV} in port ${config.PORT}`.bgGreen.bold
	);
});

// catch unhandled Rejection
process.on("unhandledRejection", (err, promise) => {
	console.log(`${err.message}`.bgRed);

	//close server
	server.close(() => process.exit(1));
});
