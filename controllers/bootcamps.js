const Bootcamp = require("../models/Bootcamp.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");

// @desc		return all Bootcamps
// @route		GET /bootcamps
const getAllBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();

	return res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @desc		return a single Bootcamp
// @route		GET /bootcamps/:id
const getSingleBootcamp = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const bootcamp = await Bootcamp.findById(id);

	if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp is not found with id: ${id}`, 404));

	return res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @desc		create new Bootcamp
// @route		POST /bootcamps
const createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);
	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

// @desc		update Bootcamp
// @route		PATCH /bootcamps/:id
const updateBootcamp = asyncHandler(async (req, res, next) => {
	const id = req.params.id;

	const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp is not found with id: ${id}`, 404));

	return res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

// @desc		delete Bootcamp
// @route		DELETE /bootcamps/:id
const deleteBootcamp = asyncHandler(async (req, res, next) => {
	const id = req.params.id;

	const bootcamp = await Bootcamp.findByIdAndDelete(id);

	if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp is not found with id: ${id}`, 404));

	return res.status(200).json({
		success: true,
		data: {},
	});
});

module.exports = {
	getAllBootcamps,
	getSingleBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
};
