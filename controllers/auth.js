const crypto = require("node:crypto");
const User = require("../models/User.js");
const Mail = require("../utils/mailHandler");
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

// @desc    forgot-password
// @routs   post /forgot-password
// @access  public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
	const email = req.body.email;
	if (!email) return next(new ErrorResponse("email is required", 400));

	const user = await User.findOne({ email: email });
	if (!user)
		return next(
			new ErrorResponse(`There's no user with an Email: ${email}`, 404)
		);

	const resetToken = user.generateResetToken();
	const resetUrl = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/reset-password/${resetToken}`;
	const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

	try {
		await Mail.launch(user.email, "Reset Password Verify", message);
		await user.save();
		return res.status(200).json({
			success: true,
			message: "check your email to reset password",
		});
	} catch (error) {
		console.log(error);
		user.resetPassswordToken = undefined;
		user.resetPasswordExpire = undefined;
		return next(
			new ErrorResponse(
				"Faild to send a verification email to reset password",
				500
			)
		);
	}
});

// @desc    reset-password
// @routs   PUT reset-password/:resetToken
// @access  public
exports.restPassword = asyncHandler(async (req, res, next) => {
	const { resetToken } = req.params;
	const { password } = req.body;

	if (!password) return next(new ErrorResponse("Password is required", 400));

	const hashToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	const user = await User.findOne({
		resetPassswordToken: hashToken,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) return next(new ErrorResponse("Token is not valied", 400));

	// reset password
	user.password = password;
	user.resetPassswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	sendTokenResponse(res, 200, user);
});
