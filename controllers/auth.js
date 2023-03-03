const User = require("../models/User.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");

// @desc    register new users
// routs    Post /register
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);
	res.status(201).json(user);
});
