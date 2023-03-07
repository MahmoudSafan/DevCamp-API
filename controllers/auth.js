const User = require("../models/User.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");
const { sendTokenResponse } = require("../utils/sendTokenResponse.js");

// @desc    register new users
// @routs   POST /register
// @access  public
exports.register = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	//send token
	sendTokenResponse(res, 201, user);
});

// @desc    login users
// @routs   POST /login
// @access  public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = { ...req.body };
	if (!email || !password)
		return next(new ErrorResponse("mail and password are required", 400));

	//find user
	const user = await User.findOne({ email }).select("+password");
	if (!user) return next(new ErrorResponse("Invalid credentials", 401));

	//match password
	const isMatch = await user.matchPassword(password);
	if (!isMatch) return next(new ErrorResponse("Invalid credentials", 401));

	//send token
	sendTokenResponse(res, 200, user);
});

// @desc    get profile
// @routs   get /profile
// @access  private
exports.getProfile = asyncHandler(async (req, res, next) => {
	const id = req.user.id;
	const user = await User.findById(id);
	return res.status(200).json({
		success: true,
		data: user,
	});
});
