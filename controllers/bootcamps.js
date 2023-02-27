const Bootcamp = require("../models/Bootcamp.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");
const geocoder = require("../utils/GeoCoder.js");
const { isNumberObject } = require("util/types");

// @desc		return all Bootcamps
// @route		GET /bootcamps
const getAllBootcamps = asyncHandler(async (req, res, next) => {
	let reqQuery = { ...req.query };
	const removeFildes = ["select", "sort", "page", "limit"];

	//remove fields from reqQuery
	removeFildes.forEach((element) => delete reqQuery[element]);

	//create comparison operators $lt, $gt...
	const queryString = JSON.stringify(reqQuery).replace(
		/\b(gt|gte|lt|lte|in)\b/,
		(match) => `$${match}`
	);

	let filter = JSON.parse(queryString);
	let dbQuery = Bootcamp.find(filter).populate({
		path: "courses",
		select: "title weeks tuition",
	});

	// select which data will retrive from Bootcamp
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		dbQuery.select(fields);
	}

	// sort date by fields || default is sorting by createdAt
	if (req.query.sort) {
		const fields = req.query.sort.split(",").join(" ");
		dbQuery.sort(fields);
	} else {
		dbQuery.sort("-createdAt"); // -fields === sort descending
	}

	// pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 10;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	dbQuery.skip(startIndex).limit(limit);

	// Execut query
	const bootcamps = await dbQuery;

	// pagination results
	const pagination = {};

	// next page
	if (endIndex < total) {
		pagination.next = { page: page + 1, limit };
	}

	//previous page
	if (startIndex > 0) {
		pagination.previous = { page: page - 1, limit };
	}

	return res.status(200).json({
		success: true,
		pagination,
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

module.exports = {
	getAllBootcamps,
	getSingleBootcamp,
	getBootcampByRadius,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
};
