const router = require("express").Router();
const bootcampas = require("./bootcamps.js");
const courses = require("./courses.js");
const auth = require("./auth.js");
const users = require("./users.js");
const review = require("./reviews.js");

// re-route to courses routs || get all courses in bootcamp
router.use("/bootcamps/:bootcampId/courses", courses);

// re-route to Review routs || get all Reviews in bootcamp
router.use("/bootcamps/:bootcampId/reviews", review);

router.use("/bootcamps", bootcampas);
router.use("/courses", courses);
router.use("/auth", auth);
router.use("/users", users);
router.use("/reviews", review);

module.exports = router;
