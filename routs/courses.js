const router = require("express").Router({ mergeParams: true });
const {
	getAllCourses,
	getSingleCourse,
	createCourse,
} = require("../controllers/course.js");

// routs begin with api/v1/courses || api/bootcamps/:bootcampId/courses
router.route("/").get(getAllCourses).post(createCourse);
router.route("/:id").get(getSingleCourse);

module.exports = router;
