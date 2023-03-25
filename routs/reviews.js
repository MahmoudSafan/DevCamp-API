const router = require("express").Router({ mergeParams: true });
const Review = require("../models/Review.js");
const {
	getAllReviews,
	getSingleReview,
	createReview,
	updateReview,
	deleteReview,
} = require("../controllers/reviews.js");

//@desc		advancedFilter is middleware takes {model and populate} and do filter
const { advancedFilter } = require("../middleware/advancedFilter");
const { auth, accessRole } = require("../middleware/auth.js");

// routs begin with api/v1/reviews || api/bootcamps/:bootcampId/reviews
router
	.route("/")
	.get(
		advancedFilter(Review, {
			path: "bootcamp",
			select: "name description location.formattedAddress",
		}),
		getAllReviews
	)
	.post(auth, accessRole("admin", "user"), createReview);

router
	.route("/:id")
	.get(getSingleReview)
	.put(auth, accessRole("admin", "user"), updateReview)
	.delete(auth, accessRole("admin", "user"), deleteReview);

module.exports = router;
