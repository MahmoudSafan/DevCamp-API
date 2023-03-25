const router = require("express").Router({ mergeParams: true });
const Review = require("../models/Review.js");
const { getAllReviews } = require("../controllers/reviews.js");

//@desc		advancedFilter is middleware takes {model and populate} and do filter
const { advancedFilter } = require("../middleware/advancedFilter");
const { auth, accessRole } = require("../middleware/auth.js");

router.route("/").get(
	advancedFilter(Review, {
		path: "bootcamp",
		select: "name description location.formattedAddress",
	}),
	getAllReviews
);

module.exports = router;
