const Course = require("../models/Course.js");
const Bootcamp = require("../models/Bootcamp.js");
const ErrorResponse = require("../utils/ErrorResponse.js");
const { asyncHandler } = require("../middleware/asyncHandler.js");

// @desc    get all courses || get courses in Bootcamp
// @routs   GET /bootcamps/:bootcampId/courses
// @routs   /courses
const getAllCourses = asyncHandler(async (req, res, next) => {
	const params = req.params;

	// get courses in specific bootcamp
	if (params.bootcampId) {
		const courses = await Course.find({ bootcamp: params.bootcampId });
		return res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		return res.status(200).json(res.advancedFilter);
	}
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

//@desc   update course
//@routs  PUT /courses/:id
const updateCourse = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const course = await Course.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!course)
		return next(new ErrorResponse(`Course not found with id: ${id}`));

	return res.status(200).json({
		success: true,
		data: course,
	});
});

//@desc   delete course
//@route  /courses/:id
const deleteCourse = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const course = await Course.findById(id);

	if (!course)
		return next(new ErrorResponse(`Course not found with id: ${id}`));

	await course.remove();

	return res.status(200).json({
		success: true,
		data: {},
	});
});

module.exports = {
	getAllCourses,
	getSingleCourse,
	createCourse,
	updateCourse,
	deleteCourse,
};
