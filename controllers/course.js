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
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(bootcampId);
	if (!bootcamp)
		return next(new ErrorResponse(`Bootcamp is not found with id: ${id}`, 404));

	// check if user is owner or he's an admin or not
	if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`You are unauthorized to create course on this bootcamp`,
				403
			)
		);
	}

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

	// find Course
	let course = await Course.findById(id);
	if (!course)
		return next(new ErrorResponse(`Course not found with id: ${id}`));

	// check if user is owner or he's an admin or not
	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(`You are unauthorized to update this course`, 403)
		);
	}

	// update Course
	course = await Course.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

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

	// check if user is owner or he's an admin or not
	if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
		return next(
			new ErrorResponse(`You are unauthorized to delete this course`, 403)
		);
	}
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
