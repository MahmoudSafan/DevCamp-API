const router = require("express").Router();
const Bootcamp = require("../models/Bootcamp");
const {
	getAllBootcamps,
	getSingleBootcamp,
	getBootcampByRadius,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	uploadBootcampPhoto,
} = require("../controllers/bootcamps.js");

//@desc		advancedFilter is middleware takes model and populate model to advanc filter
const { advancedFilter } = require("../middleware/advancedFilter");
const { auth } = require("../middleware/auth.js");

router.route("/location/:zipcode/:distance").get(getBootcampByRadius);

router.route("/:id/photos").put(uploadBootcampPhoto);

router
	.route("/")
	.get(
		advancedFilter(Bootcamp, {
			path: "courses",
			select: "title weeks tuition",
		}),
		getAllBootcamps
	)
	.post(auth, createBootcamp);

router
	.route("/:id")
	.get(getSingleBootcamp)
	.put(auth, updateBootcamp)
	.delete(auth, deleteBootcamp);

module.exports = router;
