const router = require("express").Router();
const {
	getAllBootcamps,
	getSingleBootcamp,
	getBootcampByRadius,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	uploadBootcampPhoto,
} = require("../controllers/bootcamps.js");

const Bootcamp = require("../models/Bootcamp");
//@desc		advancedFilter is middleware takes model and populate and do filter
const { advancedFilter } = require("../middleware/advancedFilter");

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
	.post(createBootcamp);

router
	.route("/:id")
	.get(getSingleBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
