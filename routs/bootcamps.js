const router = require("express").Router();
const {
	getAllBootcamps,
	getSingleBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
} = require("../controllers/bootcamps.js");

router.route("/").get(getAllBootcamps).post(createBootcamp);

router
	.route("/:id")
	.get(getSingleBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
