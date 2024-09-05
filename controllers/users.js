const ErrorResponse = require("../utils/ErrorResponse");
const { asyncHandler } = require("../middleware/asyncHandler");
const User = require("../models/User");

// @access  Private/Admin

// @desc    Create User
// @route   POST /api/v1/users
exports.createUser = asyncHandler(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(201).json({
		success: true,
		data: user,
	});
});

// @desc    Get all users
// @route   GET /api/v1/users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedFilter);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
exports.updateUser = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});
	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
exports.deleteUser = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const user = await User.findByIdAndDelete(id);
	if (!user) {
		return next(
			new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		success: true,
		data: [],
	});
});
