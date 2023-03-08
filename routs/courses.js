const router = require("express").Router({ mergeParams: true });
const {
	getAllCourses,
	getSingleCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require("../controllers/course.js");

const Course = require("../models/Course");
//@desc		advancedFilter is middleware takes {model and populate} and do filter
const { advancedFilter } = require("../middleware/advancedFilter");

const { auth, accessRole } = require("../middleware/auth.js");

// routs begin with api/v1/courses || api/bootcamps/:bootcampId/courses
router
	.route("/")
	.get(
		advancedFilter(Course, {
			path: "bootcamp",
			select: "name description location.formattedAddress",
		}),
		getAllCourses
	)
	.post(auth, accessRole("admin", "publisher"), createCourse);
router
	.route("/:id")
	.get(getSingleCourse)
	.put(auth, accessRole("admin", "publisher"), updateCourse)
	.delete(auth, accessRole("admin", "publisher"), deleteCourse);

module.exports = router;
