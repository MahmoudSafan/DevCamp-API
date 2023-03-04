const User = require("../models/User.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");

// @desc    register new users
// @routs   POST /register
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);
	const token = user.getJwt();
	res.status(201).json({
		success: true,
		token,
	});
});

// @desc    login users
// @routs   POST /login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = { ...req.body };
	if (!email || !password)
		return next(new ErrorResponse("mail and password are required", 400));

	const user = await User.findOne({ email }).select("+password");
	if (!user) return next(new ErrorResponse("Invalid credentials", 401));

	//create token
	const token = user.getJwt();
	res.status(200).json({
		success: true,
		token,
	});
});
