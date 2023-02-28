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

router.route("/location/:zipcode/:distance").get(getBootcampByRadius);

router.route("/:id/photos").put(uploadBootcampPhoto);

router.route("/").get(getAllBootcamps).post(createBootcamp);

router
	.route("/:id")
	.get(getSingleBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
