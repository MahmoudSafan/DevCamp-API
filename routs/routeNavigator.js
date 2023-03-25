const router = require("express").Router();
const bootcampas = require("./bootcamps.js");
const courses = require("./courses.js");
const auth = require("./auth.js");
const users = require("./users.js");

// re-route to courses routs || get all courses in bootcamp
router.use("/bootcamps/:bootcampId/courses", courses);

router.use("/bootcamps", bootcampas);
router.use("/courses", courses);
router.use("/auth", auth);
router.use("/users", users);

module.exports = router;
