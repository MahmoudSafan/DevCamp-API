const path = require("path");
const Bootcamp = require("../models/Bootcamp.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");
const geocoder = require("../utils/GeoCoder.js");
const { isNumberObject } = require("util/types");

// @desc		return all Bootcamps
// @route		GET /bootcamps
const getAllBootcamps = asyncHandler(async (req, res, next) => {
	return res.status(200).json(res.advancedFilter);
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
	const bootcamp = await Bootcamp.findById(id);

	if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp is not found with id: ${id}`, 404));

	// remove bootcamp and hook pre remove function to delete associated courses
	await bootcamp.remove();

	return res.status(200).json({
		success: true,
		data: {},
	});
});

// @desc		get bootcamps by geolocation zipCode/distance
// @route		GET	/bootcamps/radius
const getBootcampByRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	if (!isNumberObject(zipcode) || !isNumberObject(distance))
		return next(new ErrorResponse("zipcode and distance must be numbers", 400));

	// calculate lat/long from zipcode
	// raduis of the earth is 6371 km
	const loc = await geocoder.geocode(zipcode);
	const { longitude, latitude } = { ...loc[0] };
	const radius = distance / 6371;

	// find Bootcamps
	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: {
				$centerSphere: [[longitude, latitude], radius],
			},
		},
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});

// @desc		upload photo to Bootcamp
// @route		Put	/bootcamps/:id/photos
const uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	let image = req.files.file;
	const bootcamp = await Bootcamp.findById(id);

	if (!bootcamp) {
		return next(new ErrorResponse(`Bootcamp not found with id: ${id}`, 400));
	}
	if (!image) {
		return next(new ErrorResponse(`Please upload a photo`, 400));
	}
	// check file type and size
	if (!image.mimetype.startsWith("image") || image.size > 1024 ** 2) {
		return next(
			new ErrorResponse(`Please upload an image with max size 1MB`, 400)
		);
	}

	const ext = path.parse(image.name).ext;
	// custome file name
	image.name = `photo_${id}${ext}`;

	// move file to public/uploads directory
	image.mv(path.resolve(`./public/uploads/${image.name}`), (err) => {
		if (err) return next(new ErrorResponse("Uploading Photo Error", 500));
	});

	// update bootcamp
	await Bootcamp.findByIdAndUpdate(id, {
		image: image.name,
	});

	return res.status(200).json({
		success: true,
		data: image.name,
	});
});

module.exports = {
	getAllBootcamps,
	getSingleBootcamp,
	getBootcampByRadius,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	uploadBootcampPhoto,
};
