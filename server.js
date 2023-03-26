// import external lib
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
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

// use cookie parser
app.use(cookieParser());

// run logger only on development environment
if (config.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// serve static files
app.use(express.static(path.join(__dirname, "public")));

// uploading files
app.use(fileUpload());

// sanitize requestes & set security headers & prevent xss
app.use(sanitize());
app.use(xss());
app.use(helmet());

// configure routs
app.use("/api/v1", api);

// error handler middleware
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
	console.log(
		`server running on ${config.NODE_ENV} in port ${config.PORT}`.bgGreen.bold
	);
});

// catch uncaught exception
process.on("uncaughtException", (err, promise) => {
	console.log(`${err.message}`.bgRed);

	//close server
	server.close(() => process.exit(1));
});
