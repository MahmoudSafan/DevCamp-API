// import external lib
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const colors = require("colors");

// import internal modules
const dbConnect = require("./config/db.js");
const config = require("./config/config.js");
const { errorHandler } = require("./middleware/errorHandler.js");
const api = require("./routs/routeNavigator.js");

const app = express();

// connect to mongoose
dbConnect();

// use body parser
app.use(express.json());

// run logger only on development environment
if (config.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// uploading files
app.use(fileUpload());

// configure routs
app.use("/api/v1", api);

// error handler middleware
app.use(errorHandler);

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
