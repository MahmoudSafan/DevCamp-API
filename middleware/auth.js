const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const config = require("../config/config.js");
const { asyncHandler } = require("./asyncHandler.js");
const ErrorResponse = require("../utils/ErrorResponse.js");

// @desc		auth middleware to verify token and get token's user
exports.auth = asyncHandler(async (req, res, next) => {
	const { authorization } = req.headers;
	const cookie = req.cookies.token;
	let token;

	// check if Authorization header and token exists
	if (authorization && authorization.startsWith("Bearer"))
		token = authorization.split(" ")[1];

	if (!token) return next(new ErrorResponse("Not Authorized", 401));

	try {
		// verify and decode token
		const decodeToken = jwt.verify(token, config.JWT_SECRET);
		const user = await User.findById(decodeToken.id);
		req.user = user;
		next();
	} catch (error) {
		return next(new ErrorResponse("Not Authorized", 401));
	}
});

// @desc	  accessRole middleware to check roles authorize
exports.accessRole = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			next(new ErrorResponse("Not Authorized to access this resource", 403));
		next();
	};
};
