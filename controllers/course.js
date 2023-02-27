const Course = require("../models/Course.js");
const Bootcamp = require("../models/Bootcamp.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");

// @desc    get all courses || get courses in Bootcamp
// @routs   GET /bootcamps/:bootcampId/courses
// @routs   /courses
const getAllCourses = asyncHandler(async (req, res, next) => {
	const params = req.params;
	let dbQuery;

	if (params.bootcampId) {
		dbQuery = Course.find({ bootcamp: params.bootcampId });
	} else {
		dbQuery = Course.find().populate({
			path: "bootcamp",
			select: "name description location.formattedAddress",
		});
	}

	// execute query
	const courses = await dbQuery;

	return res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});

// @desc    get single course
// @routs   GET /courses/:courseId
const getSingleCourse = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const course = await Course.findById(id).populate({
		path: "bootcamp",
		select: "name description location.formattedAddress",
	});

	if (!course)
		return next(new ErrorResponse(`Course is not found with id: ${id}`, 404));

	return res.status(200).json({
		success: true,
		data: course,
	});
});

//@desc   create course
//@routs  POST /bootcamps/:bootcampId/courses
const createCourse = asyncHandler(async (req, res, next) => {
	const { bootcampId } = req.params;
	req.body.bootcamp = bootcampId;

	const bootcamp = await Bootcamp.findById(bootcampId);
	if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp is not found with id: ${id}`, 404));

	const course = await Course.create(req.body);

	return res.status(201).json({
		success: true,
		data: course,
	});
});
module.exports = {
	getAllCourses,
	getSingleCourse,
	createCourse,
};
