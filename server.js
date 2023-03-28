// import external lib
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const hpp = require("hpp");
const path = require("path");
const sanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
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
app.use(cors());
app.use(hpp());

// rate limit
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 15 minutes
	max: 100,
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

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
